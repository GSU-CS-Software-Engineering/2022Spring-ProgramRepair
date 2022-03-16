export class Middleware {

    fetchProblems() {
        console.log('In fetchProblems()');
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                this.problems = JSON.parse(this.responseText);
                this.$emit("saveProblems", this.problems);
            }
        };

        xhttp.open("GET", "http://localhost:8080/backend/problemlist", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
    }
}