<h1 align="center">BKMRK'D Backend 🧭</h1>

## 📚 | Problem Statement

- Bookmark’d is a platform for discovering quality book recommendations. It offers an intuitive interface for navigating through curated suggestions.
- Designed with extensive research, it prioritizes user satisfaction and accessibility.
- NodeJS, PostgreSQL, and Elasticsearch are used to optimize the backend while ReactJS and TailwindCSS are used to create a user-friendly frontend. For efficiency, Docker is utilized, and for scalability, AWS/DigitalOcean.

<br/>

## 📝 | System Design

<p align = center>
    <img alt="Project Logo" src="https://raw.githubusercontent.com/muKaustav/bkmrkd_backend/main/assets/architecture.jpeg" target="_blank" />
</p>

## 🎯 | Current Architecture:

BKMRK'D architecture is composed of several components that interact with each other to provide a scalable and robust service. Here's a breakdown of the system components and their roles:

### Client-Side

- **ReactJS Client**: The front-end of the application is built with ReactJS, a popular JavaScript library for building user interfaces. The client communicates with the backend services to render the application to the user.

```yml
Client: https://github.com/BREACH1247/bkmrkd_frontend
```

### Server-Side

- **Nginx Reverse Proxy**: An Nginx server acts as a reverse proxy, routing client requests to the appropriate backend service.

- **Express (NodeJS Backend Server)**: The backend API, `web-api`, is built using Express, a web application framework for Node.js. It handles HTTP requests from the client and interacts with the database and other services.

- **PostgreSQL**: This is the primary relational database used for storing application data.

```yml
Server: https://github.com/BREACH1247/bkmrkd_frontend
```

### Caching and Search

```yml
Redis: https://github.com/BREACH1247/bkmrkd_frontend
Elasticsearch: https://github.com/muKaustav/bkmrkd_elastic
```

- **Redis Cache**: A Redis server is used for caching, which helps improve the performance of the application by storing frequently accessed data in memory.

- **Elasticsearch**: This is a search engine based on the Lucene library, providing a distributed, multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents.

### Asynchronous Processing and Machine Learning

```yml
Recommendation Engine: https://github.com/muKaustav/bkmrkd_recommender
```

- **RabbitMQ**: RabbitMQ is an open-source message broker that enables asynchronous processing by queuing messages to be processed by workers.

- **ML Recommendation Engine (FastAPI Backend Server)**: A machine learning recommendation engine built with FastAPI, a modern, fast web framework for building APIs with Python.

- **Self Hosted NoSQL DB (MongoDB)**: MongoDB, a NoSQL database, is used for storing data that doesn't fit well into the relational model, such as documents or JSON-like data structures. The location is not specified in the image.

- **Celery Workers**: These are background workers that process tasks from the message queue (RabbitMQ). They can handle tasks like sending emails, processing files, or executing long-running jobs.

### Additional Information

- The entire application is Dockerized, which means that each component is containerized using Docker. This ensures consistency across environments and simplifies deployment and scaling.

- The architecture suggests a microservices approach, where each service is loosely coupled and can be developed, deployed, and scaled independently.

- The use of both relational (PostgreSQL) and NoSQL (MongoDB) databases indicates that the application handles different types of data and workloads, choosing the right tool for each job.

This architecture is designed to be scalable and resilient, with each component serving a specific purpose and being able to be scaled independently as needed.

<br/>

---
