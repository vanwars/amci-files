//// Grass-Making Object
//// by Ed Cavett
//// March, 2021
////
//// Use a recursive tree algorithm to make
//// a blade of grass.  Create an object
//// that will make many blades into a patch
//// of grass that appears to blend in the wind.
//// Give the patch the appearance of layers of
//// grass.

/// We need a variable to hold the grass-making
/// object.  One object of grass contains many
/// blades inside the object.
let grassy;

function setup() {
    createCanvas(windowWidth, windowHeight);
    /// Let's create one instance of the grass-making
    /// object that will contain all the blades.
    grass = new yard();
}

function draw() {
    background(0, 255);
    /// To move and show the grass,
    /// we'll need a method that we'll
    /// call using the grass variable.
    grass.update();
}

/// This grass-making function is a method
/// for producing many blades that can have
/// random or sinoidal values.
function yard() {
    /// The object contains a set of arrays
    /// that hold the unique states of each blade.
    /// We'll declare those arrays as blank to
    /// prepare for filling with element values.

    /// The x position of each blade is unique. We'll
    /// keep that value in this array.
    this.grass = [];

    /// Each blade has unique movement values.
    /// We can step through those with an
    /// array associated to the blades.
    this.roff = [];

    /// A variable is needed to hold the
    /// returned values for perlin noise given to
    /// each blade.
    this.rwave = [];

    /// We want to control the size of the blades
    /// by making them different heights.
    this.size = [];

    /// To make the blades, we'll use a recursive
    /// algorhythm.  Each pass, we'll use a
    /// smaller segment length.
    /// We'll need an array for that.
    this.seg = [];

    /// The blades are displayed uniformly according to
    /// the width of the canvas.  To keep track of
    /// the element associated with that location,
    /// we need an accumulator to hold the index value.
    this.index = 0;

    /// We may want to adjust the number of blades
    /// we make. This is the size of the arrays that
    /// we'll set to this variable.
    this.population = 150;

    /// We'll loop through the canvas's x position and
    /// increment by a size proportioned to the
    /// number of blades we are making.
    for (let x = 0; x < width; x += width / this.population) {
        /// So we know which element in the arrays to
        /// to work with, we'll increment the index value
        /// each time through the loop.
        this.index += 1;

        /// We can use the loop value (x) to set the
        /// x position of each blade, and push it into
        /// the array sequentially.
        this.grass.push(x);

        /// We'll use the index value to get
        /// a unique noise value for each blade.
        /// Since we're using perling noise,
        /// I want the offsets to be relational.
        /// We can do this by multiplying the index
        /// by a small amount and adding the results
        /// to another number.
        this.roff.push(this.index * 0.065 + 0.015);

        /// Let's start all the blades on the same
        /// perlin noise value.  We can put this
        /// value into the array using push().
        this.rwave.push(0);

        /// We want to give each blade a random size.
        /// Let's assign that to the this.size array.
        this.size.push(random(35, 55));

        /// Finally, we can give our blades an amount
        /// to decrement the length of each segment as
        /// we pass through the recursion.
        /// Here, each segment will be 85% the length
        /// of the previous one.
        this.seg.push(0.85);
    }

    /// We'll use a method to move the blades and
    /// display them.  We can put that method in our
    /// grass-making function.
    this.update = function () {
        /// We can use the accumulator that's keeping
        /// track of the number of elements in our arrays
        /// to set another loop that will move and
        /// display the blades.
        for (let i = 0; i < this.index; i++) {
            // draw many blades

            /// We can modify a recursive tree algorhythm
            /// to make a blade of grass.
            /// To do that, we start with an initial
            /// segment length.  We can get the blade's
            /// initial length from our array.
            let len = this.size[i];

            /// We want the transformations to accumulate
            /// through the recursion.  To do that,
            /// we'll isolate any tranlations or rotations
            /// to the object being manipulated.
            push();

            ///  We'll start that grass at the
            /// initial state position.  We can
            /// set the y to the bottom of the canvas.
            /// It's set in the middle, here.
            // translate(this.grass[i], height * 0.65);
            translate(this.grass[i], height);

            /// Now, we can jump to a function that will
            /// continue to call itself as it draws and
            /// rotates each blade's segment.
            /// Let's give the function a length to begin with,
            /// and let it know which element its working with.
            this.blade(len, i);

            /// We can close the encapulated tranformation
            /// for this blade, and start another
            /// with blade's x position to work from.
            pop();
        }
    };

    /// Once we have the inition starting position,
    /// and have set it to the orgin with translate(),
    /// we can start making each segment.
    /// We'll need to pass into the function the length
    /// of the segment and its index value in order
    /// to perform a recursion up the length of the blade.
    this.blade = function (len, ind) {
        /// We can split the total group of blades into
        /// two sets and handle each differently.
        /// This will make it look thicker, and dense.
        /// We can think of each group as a layer of grass.
        if (ind / 2 === int(ind / 2)) {
            /// Using the index value that was passed into the
            /// function, we can add to it an increment value.
            /// Adjust this value to sychronize or de-sync the
            /// movement of the noise and sinoidal waves.
            this.roff[ind] += 0.0025;

            /// Play around with the color to get more
            /// realism.  Adjust each segment slightly,
            /// as well as each blade.  Here, the blades
            /// are shades of green, but we can add more
            /// variety by coloring each layer differently.
            stroke(0, 255 - len * 1.5, len * 1.5, 255);

            /// Using the rotational values, we can
            /// get our random noise and map the return values
            /// to fractions of PI.
            rot = map(
                noise(this.roff[ind]),
                0,
                1,
                -QUARTER_PI * 0.75,
                QUARTER_PI * 0.75
            );
        }

        /// For variety, let's set the other layer
        /// of blades to a sin wave.  We can map the
        /// return values to the same fractions of PI.
        if (ind / 2 != int(ind / 2)) {
            /// The sin wave values need to move slower
            /// than the noise.  We can do that here.
            this.roff[ind] += 0.0025;

            /// We can make an orange-brown color for this
            /// layer.  Set the red high and green low.
            /// Add a small amount of blue.
            stroke(255 - len * 2.5, len * 2.5, 10, 255);
            rot = map(
                -sin(this.roff[ind]),
                -1,
                1,
                -QUARTER_PI * 0.25,
                QUARTER_PI * 0.25
            );
        }
        /// The blade's width we can set with the
        /// strokeWeight.  We can make a formula
        /// to reduce the blade's width as it
        /// makes a new segment.
        strokeWeight(len * 2 * random(0.07, 0.11));
        /// Let's rotate the segment then reposition
        /// the origin to the end of that segment after
        /// we draw it with a line of -len length.
        /// We use negative to make the blade upwardly.
        rotate(rot);
        line(0, 0, 0, -len);
        translate(0, -len);
        /// To avoid an infinite loop, we have to
        /// check the length of the segment to ensure
        /// that it's long enough to re-segment.
        /// If it's long enough, we can call this
        /// function from within itself, to perform
        /// a recursive operation on each segment we make.
        if (len > 20) {
            this.blade(len * this.seg[ind], ind);
        }
    };
}
