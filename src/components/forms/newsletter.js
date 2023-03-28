import React from "react"
import { navigate } from "gatsby-link"

export default class Newsletter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      prudent: true,
      switchable: true,
    }
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value,
    })
  }

  handleCheckboxChange = event => {
    const { name } = event.target
    this.setState({ [name]: !this.state[name] })
  }

  handleScroll = e => {
    if (this.state.switchable) {
      this.setState({ prudent: false, switchable: false })
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  }

  handleSubmit = e => {
    e.preventDefault()
    const form = e.target

    const formFields = { enabled: "" }
    for (var key in this.state) {
      if (this.state.hasOwnProperty(key)) {
        let k = key
        if (k === "google") k = "email"
        if ("prudent switchable".includes(k) === false) {
          formFields[k] = this.state[key]
        }
      }
    }
    formFields.segment_id = 10
    console.log("formFields: ", formFields)
    console.log("form", form)
    console.log("attribute-name", form.getAttribute("name"))
    console.log(
      "json body",
      JSON.stringify({
        formName: form.getAttribute("name"),
        formFields,
      })
    )

    fetch("/.netlify/functions/postgresqlSubmission", {
      method: "POST",
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: JSON.stringify({
        formName: form.getAttribute("name"),
        formFields,
      }),
    })
      .then(() => navigate(form.getAttribute("action")))
      .catch(error => alert(error))
  }

  render() {
    let initial = (
      <input
        type="text"
        id="enable"
        name="enable"
        onChange={this.handleChange}
        required
      />
    )
    let notprudent = (
      <input
        type="text"
        id="google"
        name="google"
        placeholder="Your Email"
        onChange={this.handleChange}
        required
      />
    )

    let line = this.state.prudent ? initial : notprudent

    return (
      <div className="col-12 col-md-6 col-lg-4">
        <p className="p--xl u-color-black-2">
          <strong>SIGN UP FOR A NEWSLETTER</strong>
        </p>
        <p className="u-color-gray-13">
          Weekly breaking news, analysis and cutting edge advices on job
          searching.
        </p>
        <form
          name="newsletter"
          onSubmit={this.handleSubmit}
          className="footer__subscribe debug-red"
          action="#"
        >
          {line}
          <div
            ref={element => {
              if (element) {
                element.style.setProperty("display", "none", "important")
              }
            }}
          >
            <input
              type="checkbox"
              name="marketing_emails"
              value="1"
              onChange={this.handleCheckboxChange}
              tabIndex="-1"
              autoComplete="off"
            />
          </div>
          <button className="btn" type="submit">
            SUBMIT
          </button>
        </form>
      </div>
    )
  }
}
