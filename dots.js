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

const Dot = Object.freeze({
    new: function(x, y, radius, colors) {
        
        let numClicks = 0;
        
        const circle = Circle.new();
        circle.x = x;
        circle.y = y;
        circle.radius = radius;
        circle.fill = circle.stroke = colors[numClicks];
        
        const onClick = function() {
            numClicks++;
            if (numClicks >= colors.length) {
                circle.remove();
                addCircleAt(Math.random() * svg.width, Math.random() * svg.height);
            } else {
                circle.fill = circle.stroke = colors[numClicks];
            }
        };
        
        circle.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            onClick();   
        });
        
        return {
            
            display: function(svg) {
                svg.appendChild(circle);
            },
            
            remove: function() {
                circle.remove();
            },
            
        };
        
    },
});

const addCircleAt = function(x, y) {
    Dot.new(x, y, RADIUS, COLORS).display(svg);
};

svg.addEventListener("click", e => addCircleAt(e.offsetX, e.offsetY, RADIUS, COLORS));
