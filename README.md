# Update
I decoupled the CRUD logic (in a custom hook called useCRUD) from UI in SearchResult component, code looked a bit cleaner. However, I am having some trouble testing the RXJS observables. I'm figuring it out :)

# Requirements:

- Engineering can choose Angular or React to sketch a quick GUI
  - I used react with ts and tsx.
- Engineering need create a search page with search criteria and result table, engineering need create a popup dialog (modal dialog) to display the detail reservation and GUI MUST be Material GUI
  - The homepage of the website is structured with search criteria at the top and search results at the bottom. Additionally, there is a prominently placed "New Reservation" button in the center for initiating new reservations.
  - Clicking the "New Reservation" button or any row entry in the result table triggers a modal dialog page to pop up, closely resembling the provided GUI design.
  - All UI components, including grids, input fields, and a data grid for data display, are sourced from Material-UI (MUI), contributing to a cohesive design.
- Engineering MUST use AWS S3 or RDS to store/retrieve the reservation data. 
  - The source data are stored in an AWS S3 bucket named "hotel-reservations-yujie-source."
  - The data were not stored in JSON format because manipulating CUD operations with JSON files directly in S3 is challenging. Services like S3 select and Athena only allow SELECT operations on JSON files. Using a JSON file, we would need to download the entire dataset and perform in-memory filtering to execute CUD operations, which is not ideal.
  - The source data type was changed to an Apache Iceberg table. With AWS Athena, we can directly use SQL queries to perform all CRUD operations, allowing direct modification of the data source.
- Engineering MUST use Lambda to wrap the CRUD logic and API gateway to publish the endpoint.
  - For each CRUD request made by the user, we send REST requests to the API Gateway.
  - The API Gateway triggers different Lambda functions according to the type of request (GET, POST, PUT, DELETE). At this stage, the triggered Lambda functions prepare the SQL query statement.
  - Upon successfully preparing the SQL query statement, the Lambda function triggers a state machine to:
    - Query Athena.
    - Wait for Athena to complete the query.
    - If the operation type is Update, Create, or Delete, an additional Search (for all results, to provide users with updated information for display) will be sent to Athena as well.
    - Fetch and clean query results.
    - Send the results back to the user.
  - All above operations are conducted within the state machine, allowing any errors (if present) to be handled gracefully by AWS Step Functions.
  - Note that the state machine is set to express mode, allowing us to perform synchronous executions and enabling real-time responses to be sent back to users.
- Engineering MUST use Steps function to implement the search logic.
  - Given the simplicity of our dataset, I am assuming that 'search' operations are equivalent to 'read' operations.
- Engineer need to use RXJS to execute API gateway.
  - The front-end API interactions are encapsulated within RSJS observables to manage asynchronous calls and state manipulation.
    - For search calls, the state of the search criteria is wrapped in a useEffect hook. Each change in the state triggers an observable to emit a new value. Upon emission of this new value, a search API call is initiated, and the results are received by the observer (the search result table). To implement dynamic search functionality and reduce the number of API calls, I have applied a debounce time to user inputs to reduce the number of API calls.
    - For other operations (Create, Update, Delete), these are triggered by button clicks within a Modal Dialog. The API calls are converted into an observable (using fromFetch) so that the search result table can observe and react to new values.

# Additional notes:

- The website is hosted on AWS S3 and is publicly accessible at [http://yujie-wu-reservation-website.s3-website-us-east-1.amazonaws.com](http://yujie-wu-reservation-website.s3-website-us-east-1.amazonaws.com)
- Github actions were created for CI and CD:
  - With each push from a non-main branch, the test pipeline is triggered to perform front-end ESLint checks, Jest tests, back-end ESLint checks, Jest tests, and end-to-end Playwright tests. If all test cases succeed, a pull request will be automatically created.
  - By manually approving the pull request and merging it into the main branch, another workflow is triggered to automatically update Lambda functions and the website build on AWS.
- An area for improvement: When designing the data source structure, I did not consider adding an ID attribute (which would necessitate implementing ID auto-generation rules). This oversight made performing SQL queries more challenging, as all data fields can be non-unique.

Last but not least, thank you so much for your time and enjoy!
