const express = require("express");
const bodyParser = require("body-parser");
require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//connecting to the server
mongoose.connect("mongodb+srv://<Username>:<password>@todolist.0egpa.mongodb.net/blogSite?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//schema of the post
const postSchema = {
    title: String,
    poBody: String
}

//model of the post
const Entry = new mongoose.model('entry', postSchema);


//home route
app.get("/", function (req, res) {
    Entry.find({}, function (err, arr) {
        res.render("home", {
            startingContent: homeStartingContent,
            posts: arr
        });
    });
});


//about route
app.get("/about", function (req, res) {
    res.render("about", {aboutContent: aboutContent});
});


//contact route
app.get("/contact", function (req, res) {
    res.render("contact", {contactContent: contactContent});
});


//compose get route
app.get("/compose", function (req, res) {
    res.render("compose");
});


// compose get route
app.post("/compose", function (req, res) {
    const postBody = (req.body.postBody).trim();             // body of the post
    const postTitle = _.capitalize(req.body.postTitle).trim();           // title of the post
    Entry.findOne({title: postTitle}, function (err, found) {
        if (err)
            console.log(err);
        if (found) {
            found.poBody = postBody;
            found.save();
            res.redirect("/");
        } else {
            const post = new Entry({
                title: postTitle,
                poBody: postBody
            });
            post.save();
            res.redirect("/");

        }
    });


});

app.get("/posts/:postName", function (req, res) {
    const requestedTitle = _.capitalize(req.params.postName);

    Entry.findOne({title: requestedTitle}, function (err, found) {
        res.render("post", {
            title: found.title,
            content: found.poBody
        });
    });
});

let port = process.env.PORT;
if(port==null||port==="")
{
    port=3000;
}

app.listen(port, function () {
    console.log("Server started on port 3000");
});
