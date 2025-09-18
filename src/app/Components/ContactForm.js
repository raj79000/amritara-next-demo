"use client";
import { useState } from "react";
import toast from "react-hot-toast";
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    source_enquiry: "alivaa-blog-contact-us",
    web_source: "alivaahotels.com",
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation (simple regex)
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Phone validation (digits only, length check)
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10,}$/.test(formData.phone.trim())) {
      newErrors.phone =
        "Phone must be at least 10 digits and contain digits only";
    }

    // subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "subject must be at least 5 characters";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 5) {
      newErrors.message = "Message must be at least 5 characters";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error message on input change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setLoading(true);
    setResponseMsg("");

    try {
      const response = await fetch(
        "https://demo.cinuniverse.com/alivaa/blog-contact-mail.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        toast.success(result.message || "Form submitted successfully!");
        setResponseMsg(result.message || "Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          source_enquiry: "alivaa-blog-contact-us",
          web_source: "alivaahotels.com",
        });
        setErrors({});
      } else {
        toast.error(result.message || "Submission failed!");
        setResponseMsg(result.message || "Submission failed!");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setResponseMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setResponseMsg(""), 8000); // Clear message after 5 seconds
    }
  };

  return (
    <>
      <aside className="fixed-blog-form">
        <div className="commerce-side-panel blog-page-contact-form">
          <form
            onSubmit={handleSubmit}
            id="contact"
            name="info_form"
            className="i-amphtml-form"
            noValidate
          >
            <h3 className="text-center">Contact Us</h3>

            <h4></h4>

            <fieldset>
              <input
                type="text"
                name="name"
                maxLength={30}
                placeholder="Name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border form-control ${
                  errors.name ? "is-invalid" : ""
                }`}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </fieldset>

            <fieldset>
              <input
                type="email"
                name="email"
                placeholder="Email"
                maxLength={100}
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border form-control ${
                  errors.email ? "is-invalid" : ""
                }`}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </fieldset>

            <fieldset>
              <input
                type="tel"
                maxLength={10}
                name="phone"
                placeholder="Phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 border form-control ${
                  errors.phone ? "is-invalid" : ""
                }`}
              />
              {errors.phone && (
                <small className="text-danger">{errors.phone}</small>
              )}
            </fieldset>

            <fieldset>
              <input
                type="text"
                name="subject"
                max={50}
                placeholder="Subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className={`w-full p-2 border form-control ${
                  errors.subject ? "is-invalid" : ""
                }`}
              />
              {errors.subject && (
                <small className="text-danger">{errors.subject}</small>
              )}
            </fieldset>

            <fieldset>
              <textarea
                name="message"
                placeholder="Message"
                maxLength={500}
                required
                value={formData.message}
                onChange={handleChange}
                className={`w-full p-2 border form-control ${
                  errors.message ? "is-invalid" : ""
                }`}
              />
              {errors.message && (
                <small className="text-danger">{errors.message}</small>
              )}
            </fieldset>

            <fieldset>
              <button
                type="submit"
                disabled={loading}
                className="btn contactSubmit-blog mt-1"
              >
                {loading ? "Sending..." : "Submit"}
              </button>

              {/* ✅ Response Message */}
              {responseMsg && (
                <p
                  className="mt-3 "
                  style={{
                    color: responseMsg.toLowerCase().includes("success")
                      ? "green"
                      : "green",
                    fontWeight: "bold",
                  }}
                >
                  {responseMsg}
                </p>
              )}
            </fieldset>
          </form>
        </div>
      </aside>
    </>
  );
};

export default ContactForm;
