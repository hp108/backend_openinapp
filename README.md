---

# Task Management API

This project implements a RESTful API for task management, including features such as creating tasks and sub-tasks, updating task statuses, fetching tasks with filters, soft deletion of tasks and sub-tasks, and implementing cron jobs for task priority adjustments and voice calling using Twilio.

## Setup

1. Clone the repository:

    ```bash
    git clone <repository_url>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following variables:

    ```
    PORT=3000
    DB_URL=<your_database_url>
    JWT_SECRET=<your_jwt_secret_key>
    TWILIO_SID=<your_twilio_account_sid>
    TWILIO_TOKEN=<your_twilio_auth_token>
    ```

4. Run the application:

    ```bash
    npm start
    ```

    The API will be available at `http://localhost:3000`.

## API Endpoints

1. **Create Task**
   - Method: POST
   - Endpoint: `/task/create`
   - Headers: `Authorization: Bearer <JWT_Token>`
   - Body:
     ```json
     {
       "title": "Task Title",
       "description": "Task Description",
       "dueDate": "2024-03-15"
     }
     ```

2. **Create Sub Task**
   - Method: POST
   - Endpoint: `/subtask/create`
   - Headers: `Authorization: Bearer <JWT_Token>`
   - Body:
     ```json
     {
       "status": 0
     }
     ```

3. **Get User Tasks**
   - Method: GET
   - Endpoint: `/task/`
   - Headers: `Authorization: Bearer <JWT_Token>`
   - Query Parameters: `priority`, `dueDate`, `page`, `limit`

4. **Get User Sub Tasks**
   - Method: GET
   - Endpoint: `/subtask/`
   - Headers: `Authorization: Bearer <JWT_Token>`
   - Query Parameters: `taskId`

5. **Update Task**
   - Method: PUT
   - Endpoint: `/task/update`
   - Headers: `Authorization: Bearer <JWT_Token>`
   - Query Parameters: `taskId`
   - Body:
     ```json
     {
       "dueDate": "2024-03-20",
       "status": "DONE"
     }
     ```

6. **Update Sub Task**
   - Method: PUT
   - Endpoint: `/subtask/update`
   - Headers: `Authorization: Bearer <JWT_Token>`
   - Query Parameters: `subTaskId`
   - Body:
     ```json
     {
       "status": 1
     }
     ```

7. **Delete Task**
   - Method: DELETE
   - Endpoint: `/task/delete`
   - Headers: `Authorization: Bearer <JWT_Token>`
   - Query Parameters: `taskId`

8. **Delete Sub Task**
   - Method: DELETE
   - Endpoint: `/subtask/delete`
   - Headers: `Authorization: Bearer <JWT_Token>`
   - Query Parameters: `subTaskId`

## Cron Jobs

1. **Change Priority of Task**
   - Logic: Adjust priority based on due_date
   - Cron Expression: `0 0 * * *` (Every day at midnight)

2. **Voice Calling using Twilio**
   - Logic: Call users if tasks pass due_date based on priority
   - Cron Expression: `0 12 * * *` (Every day at 12:00 PM)

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Twilio API

## Contributors

- [Your Name](https://github.com/your_username)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---