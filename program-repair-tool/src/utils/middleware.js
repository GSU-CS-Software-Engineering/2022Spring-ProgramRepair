export default async function fetchProblems() {
        const response = await fetch('http://localhost:3080/api/problemlist', {
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        if (response.status !== 200) {
            console.log('Error! Status: ' + response.status);
            return '[{}]';
        }
        else {
            console.log(data);
            return data;
        }
    }


