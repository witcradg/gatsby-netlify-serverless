import React, { useState } from "react"
import { navigate } from "gatsby-link"

export const Newsletter = () => {
  const [email, setEmail] = useState("")

  const handleChange = event => {
    setEmail(event.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const formFields = {}

    for (let [name, value] of formData.entries()) {
      console.log(`${name}: ${value}`)
      formFields[name] = value
    }

    fetch("/.netlify/functions/postgresqlSubmission", {
      method: "POST",
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: JSON.stringify({
        formName: e.target.name,
        formFields,
      }),
    })
      .then(() => navigate(e.target.actiond))
      .catch(error => alert(error))
  }

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <p className="p--xl u-color-black-2">
        <strong>SIGN UP FOR A NEWSLETTER</strong>
      </p>
      <p className="u-color-gray-13">
        Weekly breaking news, analysis and cutting edge advices on job
        searching.
      </p>
      <form name="newsletter" onSubmit={handleSubmit}
          className="footer__subscribe debug-red"
          action="#footer">
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
