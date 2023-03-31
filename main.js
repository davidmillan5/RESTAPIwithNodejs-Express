'use strict';

const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  Joi = require('joi');

app.use(express.json()); //Adding a piece of middleware

const courses = [
  { id: 1, name: 'Math' },
  { id: 2, name: 'JavaScript' },
];

app.get('/', (req, res) => {
  res.send('Message...');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send('The course with the given Id was not found');
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send('The course with the given Id was not found');
  //validate
  // If invalid, return 400 - Bad Request

  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  course.name = req.body.name;
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.ValidationError(course, schema);
}

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send('The course with the given Id was not found');

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
