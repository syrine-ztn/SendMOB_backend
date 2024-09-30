# SendMOB Application

The SendMOB platform is designed to enable businesses to send SMS to their clients and target audiences efficiently. It offers a centralized online solution accessible through a web browser, providing a full range of features for managing clients, campaigns, and processes.

## System Overview
### Actors in the System
#### 1- Clients: 
Businesses use the SendMOB platform to send SMS messages to their customers or specific recipients. They choose a subscription plan and make online payments to access the platform's services. Clients manage SMS campaigns, view reports, and file complaints through the client dashboard.
#### 2- Recipients:
These are the individuals or groups who receive SMS messages sent by the businesses using the platform. Recipients could be customers, employees, or any other target group as defined by the client. Their role is to receive messages and take actions based on the content of the SMS.
#### 3- Administrator:
The administrator is responsible for overseeing the entire SendMOB platform. They manage client accounts, configure subscription plans, handle complaints, and generate reports. Administrators also have the authority to add, modify, or remove features as needed.
#### 4- Agent (Moderator):
Agents provide operational support to the platform's clients. They resolve client complaints, offer technical assistance, and manage the assigned client accounts. Agents use a specialized dashboard to track customer requests, respond to questions, and resolve issues efficiently.

### Repositories
This project consists of the following repositories:
##### 1- SendMOB_admin
##### 2- SendMOB_client
##### 3- SendMOB_moderateur
##### 4- SendMOB_backend
##### 5- SendMOB_Chatbot
##### 6- SendMOB_database

### Port Allocation
##### 1- Admin: `localhost:3000`
##### 2- Moderator: `localhost:3001`
##### 3- Client: `localhost:3002`

## Commands

### Frontend Commands:
```bash
npm run dev
```
### Backend Commands:
```bash
npm init
npm install express
npx sequelize-auto -o "./models" -d sendmob -h localhost -u root -p 3306 -x -e mysql
node src/app
```
### Rasa Chatbot Commands (Preferably using Anaconda Prompt):

##### 1- Installing Rasa:
```bash
conda deactivate
conda create -n rasaenv
conda activate rasaenv
pip install rasa
rasa init
```
##### 2- Communicating with Rasa:
```bash
rasa shell
```
##### 3- Running Rasa Endpoints:
```bash
rasa run --cors "*" --enable-api
rasa run actions
```
##### 4- Training the Model:
```bash
rasa train
```
## Note 
You can find each repository on my GitHub.
