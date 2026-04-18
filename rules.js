class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.inv = [];
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        console.log("data", this.engine.storyData["InitialLocation"]);
        this.engine.gotoScene(Location, this.engine.storyData["InitialLocation"]); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        this.key = key;
        let locationData = this.engine.storyData.Locations[key]; // TODO: use key to get the data object for the current story location
        console.log("Location.create-> locationData", locationData);
        this.engine.show(locationData.Body); //this.engine.show("Body text goes here"); // TODO: replace this text by the Body of the location data
        //this.engine.show(locationData?.some.?thing);
        //if(true) { // TODO: check if the location has any Choices
            if (locationData.Choices && locationData.Choices.length >0){
             for(let choice of locationData.Choices) { 
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
             }
            } else {
                this.engine.addChoice("The end.");
            }

    }

    handleChoice(choice) {

        if(!choice)
        {
            this.engine.gotoScene(End);
            return;
        }

        if(choice.Action == "pickup")
        {
            let locationData = this.engine.storyData.Locations[this.key];
            let item = locationData.Item;

            if(item && !this.engine.inv.includes(item))
            {
                this.engine.inv.push(item); 
                this.engine.show("> Picked up " + item);
            }

            this.engine.gotoScene(Location, this.key);
            return;
        }

        if(choice.Requires)
        {
            this.engine.show("> "+ choice.Text);
            if(this.engine.inv.includes(choice.Requires))
            {
                this.engine.show("You use the " + choice.Requires + " to break open the firewall.");
                this.engine.gotoScene(Location,choice.Target);
            }
            else
            {
                this.engine.show(choice.LockedText);
                this.engine.gotoScene(Location, this.key);

            }
            return;

        }

        this.engine.show("> "+ choice.Text);
        this.engine.gotoScene(Location,choice.Target);
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
