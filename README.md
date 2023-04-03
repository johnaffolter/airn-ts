[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/jakearmijo/airn-ts">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Life Coach App</h3>

  <p align="center">
    This project allows users to text a number and received response from ChatGPT.
    <br />
    <a href="https://github.com/jakearmijo/airn-ts"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/jakearmijo/airn-ts">View Demo</a>
    ·
    <a href="https://github.com/jakearmijo/airn-ts/issues">Report Bug</a>
    ·
    <a href="https://github.com/jakearmijo/airn-ts/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

The life coaching service has created an innovative application using various technologies such as Node.js, Express, Twilio Node, ChatGPT Node, Stripe, and MongoDB. This application provides an easy and accessible way for users to get in touch with their life coach by simply texting a Twilio number. Once a message is sent, the application utilizes ChatGPT Node to generate a response that is tailored to the user's needs. In addition to the messaging feature, the application also integrates with Stripe for secure payment processing and MongoDB for efficient data storage. With the help of this application, users can receive personalized coaching and guidance at their convenience without any hassle.

To facilitate ease of deployment, the application has been containerized with Docker and deployed using the AWS CDK on AWS ECS. The application has been defined inside ECS task definitions and container definitions, and it runs on AWS Fargate. An application load balancer has been set up to distribute incoming traffic evenly across the application's instances. This ensures that users can access the application quickly and efficiently, regardless of their location. By leveraging the power of AWS, the life coaching service has developed a highly scalable and reliable application that delivers a seamless experience to its users.

### Built With

This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [AWS](https://aws.amazon.com/)
* [Node](https://nodejs.org/en)
* [Twilio](https://www.twilio.com/)
* [Docker](https://www.docker.com/)
* [MongoDB](https://www.mongodb.com/)
* [Stripe](https://www.stripe.com/)

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* npm

  ```sh
  npm install npm@latest -g
  ```

### Installation

You must have the architecture deployed into your AWS Account for App to work. You can grab the cdk code from the link below?

* [https://github.com/jakearmijo/aiRN-infrastructure](InfrastructureCode)

1. Get a API Keys and Create Accounts
    * [https://platform.openai.com/account/api-keys](OpenAI)
    * [https://www.twilio.com/try-twilio](Twilio)
    * [https://www.mongodb.com/cloud/atlas/register](MongoDB)
    * [https://sendblue.co/signup](SendBlue)

2. Clone the repo

   ```sh
   git clone https://github.com/jakearmijo/airn-ts.git
   ```

3. Install NPM packages

   ```sh
   npm install
   ```

4. Enter your API in a `.env` file

    ```text
      OPENAI_API_KEY=Enter_Value
      ACCOUNT_SID=Enter_Value
      AUTH_TOKEN=Enter_Value
      MONGODB_USERNAME=Enter_Value
      MONGODB_PASSWORD=Enter_Value
      MONGODB_UR=Enter_Value
      SEND_BLUE_API_KEY=Enter_Value
      SEND_BLUE_SECRET=Enter_Value
      STRIPE_TEST_SECRET_KEY=sEnter_Value
    ```

5. Build Docker container

    ```sh
      docker build -t jakearmijo/life-coach-app-airn-ts .
    ```

6. Run the Docker image

    ```sh
      docker run --rm --env-file=./.env -p 80:80 --name=enter_a_image_name_here jakearmijo/life-coach-app-airn-ts
    ```
<!-- USAGE EXAMPLES -->
## Usage

Here are a few examples of how the life coaching application described above can be used:

1. A user who is feeling stressed out and overwhelmed can send a message to the Twilio number to receive guidance and support from their life coach. The ChatGPT Node integration allows the application to generate a personalized response that addresses the user's specific concerns and offers practical advice for managing their stress.

2. A user who wants to improve their productivity can text the Twilio number to receive tips and strategies from their life coach. The application can leverage ChatGPT Node to provide customized advice based on the user's goals and preferences, helping them to achieve greater efficiency and focus.

3. A user who is struggling with a difficult decision can reach out to their life coach via the Twilio number to receive guidance and support. The application can use ChatGPT Node to help the user clarify their thoughts and feelings, and to explore different options and outcomes for their decision.

4. A user who wants to book a coaching session can use the integrated Stripe payment processing to easily and securely pay for their appointment. The application can leverage MongoDB to manage scheduling and other administrative tasks, ensuring a seamless and convenient experience for the user.

Overall, the life coaching application described above provides a powerful and flexible tool for users to connect with their coach, receive personalized guidance and support, and manage their coaching sessions and payments with ease.

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/jakearmijo/airn-ts/issues) for a list of proposed features (and known issues).

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Contact - [Jake Armijo](https://www.linkedin.com/in/jake-armijo/) - jakearmijo@chatgptmvp.com
Contact - [John Affolter](https://www.linkedin.com/in/john-a-27940242/) - johnaffolter@chatgptmvp.com

Project Link: [https://github.com/jakearmijo/airn-ts](https://github.com/jakearmijo/airn-ts)

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [Jake Armijo](https://www.jakearmijo.com/)
* [John Affolter](https://www.linkedin.com/in/john-a-27940242/)
* [Ryan Negri](https://ryannegri.com/)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Pages](https://pages.github.com)
* [Animate.css](https://daneden.github.io/animate.css)
* [Loaders.css](https://connoratherton.com/loaders)
* [Slick Carousel](https://kenwheeler.github.io/slick)
* [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
* [Sticky Kit](http://leafo.net/sticky-kit)
* [JVectorMap](http://jvectormap.com)
* [Font Awesome](https://fontawesome.com)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/jakearmijo/aiRN.svg?style=for-the-badge
[contributors-url]: https://github.com/jakearmijo/airn-ts/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/jakearmijo/aiRN.svg?style=for-the-badge
[forks-url]: https://github.com/jakearmijo/airn-ts/network/members
[stars-shield]: https://img.shields.io/github/stars/jakearmijo/aiRN.svg?style=for-the-badge
[stars-url]: https://github.com/jakearmijo/airn-ts/stargazers
[issues-shield]: https://img.shields.io/github/issues/jakearmijo/aiRN.svg?style=for-the-badge
[issues-url]: https://github.com/jakearmijo/airn-ts/issues
[license-shield]: https://img.shields.io/github/license/jakearmijo/aiRN.svg?style=for-the-badge
[license-url]: https://github.com/jakearmijo/airn-ts/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/jake-armijo