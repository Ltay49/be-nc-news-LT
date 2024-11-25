# Northcoders News API
1. remember to create your .env files for setting variable environments, respectively for dev and test data. These are ignored when uploaded and pulled from Github. See the setup.sql for the db names. 'npm install' will also be useful, alternatively 'npm i dotenv'. NOTE - I have set the development variable to look for '.env.dev'.

2. 'GET Api'
the endopoit represents an access route to a specific location. In this scenario it leading the client to a local json file with other differnt endpoints.

beyond a basic request like shown in the frst test the endpoint can be more detailed and ask for routes to specific information. The information can be reduced down by using queries such as "/api/treasures?sort_by=cost_at_auction". The query is initialized by ? and then specific information requested is the value after the '='. The 'sort_by' if present in teh Api will trigger a query made in the sql db later on via the model.

the reponse body typically comes as a large object with a lot of information not needed in the client reposne, we want to highlight and repsond with a key value in order to filter the desired response.

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
