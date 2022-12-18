const express = require('express');
const newsRoute = new express.Router();
const nodemailer = require("nodemailer");


//We send email to the client using nodemailer

newsRoute.post("/news", (req, res) => {
	const { email } = req.body;
	console.log(email, 555)

	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD
			}
		});

		const mailOptions = {
			from: process.env.EMAIL,
			to: email,
			subject: 'Welcome to our website',
			text: "We bring you the news about your favorite products"
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log("Error", error)
			} else {
				console.log("Email sent" + info.response);
				res.status(201).json({ status: 201, info })
			}
		})

	} catch (error) {
		res.status(401).json({ status: 401, error })
	}
});


module.exports = newsRoute;