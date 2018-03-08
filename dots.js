Array.prototype.clear = function() {
    this.length = 0;
};

Element.prototype.clearHTML = function() {
    this.innerHTML = "";
};

Element.prototype.setAttributes = function(attributes) {
    for (const attribute in attributes) {
        if (attributes.hasOwnProperty(attribute) && attributes[attribute]) {
            this.setAttribute(attribute, attributes[attribute].toString());
        }
    }
};

const div = document.body.appendChild(document.createElement("div"));

const svgCreate = document.createElementNS.bind(document, "http://www.w3.org/2000/svg");

Element.prototype.addProperty = function(property, attribute) {
    if (!attribute) {
        attribute = property;
    }
    Object.defineProperty(this, property, {
        get: function() {
            return this.getAttribute(attribute);
        },
        set: function(value) {
            this.setAttribute(attribute, value);
        },
    });
};

Element.prototype.addProperties = function(propertiesToAttributes) {
    if (Array.isArray(propertiesToAttributes)) {
        propertiesToAttributes.forEach(attribute => this.addProperty(attribute));
    } else {
        for (const property in propertiesToAttributes) {
            if (propertiesToAttributes.hasOwnProperty(property)) {
                this.addProperty(property, propertiesToAttributes[property]);
            }
        }
    }
};

const svg = div.appendChild(svgCreate("svg"));
svg.addProperties(["width", "height"]);
svg.width = 600;
svg.height = 600;
svg.style.border = "1px solid black";

const button = div.appendChild(document.createElement("button"));
button.innerText = "Clear";
button.addEventListener("click", function(e) {
    e.preventDefault();
    svg.clearHTML();
    Dot.all.clear();
});

const RADIUS = 50;
const COLORS = ["red", "blue", "green"];

const Circle = Object.freeze({
    new: function() {
        const circle = svgCreate("circle");
        circle.addProperties({
            x: "cx",
            y: "cy",
            radius: "r",
            fill: "fill",
            stroke: "stroke",
        });
        return circle;
    },
});

const Dot = (() => {
             
    let lastId = 0;
    
    return Object.freeze.call({}, {
        
    all: [],
    
    new: function(x, y, radius, colors) {
    
        const _id = lastId++;
            
        let _x = x;
        let _y = y;
        let _radius = radius;
        let _colors = colors;
            
        let numClicks = 0;
        
        const circle = Circle.new();
        circle.x = x;
        circle.y = y;
        circle.radius = radius;
        Object.defineProperty(circle, "color", {
            set: function(color) {
                this.fill = this.stroke = color;
            },
        });
        circle.color = _colors[numClicks];
        
        let _svg = null;
        
        const onClick = function() {
            numClicks++;
            if (numClicks >= _colors.length) {
                numClicks = -1; // will be 0 after recursive call
                circle.x = _x = Math.random() * _svg.width;
                circle.y = _y = Math.random() * _svg.height;
                onClick(); // reset color
            } else {
                circle.color = _colors[numClicks];
            }
        };
        
        circle.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            onClick();   
        });
        
        const dot = {
            
            get id() {
                return _id;
            },
            
            get x() {
                return _x;
            },
            
            set x(x) {
                circle.x = _x = x;
            },
            
            get y() {
                return _y;
            },
            
            set y(y) {
                circle.y = _y = y;
            },
            
            get radius() {
                return _radius;
            },
            
            set radius(radius) {
                circle.radius = _radius = radius;
            },
            
            get colors() {
                return _colors;
            },
            
            set colors(colors) {
                _colors = colors;
            },
            
            display: function(svg) {
                this.remove();
                _svg = svg;
                svg.appendChild(circle);
            },
            
            remove: function() {
                if (_svg !== null) {
                    circle.remove();
                    _svg = null;
                    Dot.all.splice(Dot.all.findIndex(dot => dot.id === _id), 1);
                }
            },
            
        };
        
        return Object.freeze(dot);
        
    },
    
})})();

const addCircleAt = function(x, y) {
    const dot = Dot.new(x, y, RADIUS, COLORS);
    dot.display(svg);
    Dot.all.push(dot);
};

svg.addEventListener("click", e => addCircleAt(e.offsetX, e.offsetY, RADIUS, COLORS));
