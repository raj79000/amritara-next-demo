"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faEnvelope, faMobileAlt } from "@fortawesome/free-solid-svg-icons";
import "./contactus.css";
const HotelContactUs = () => {
  return (
    <>
      <section>
        <div className="bg-light pb-3 pt-3">
          <div className="container-md contact-addres">
            <div className="row">
              <div className="col-12 col-lg-4 col-sm-4">
                <div className="item">
                  <span className="icon feature_box_col_three">
                    <FontAwesomeIcon icon={faMobileAlt} />
                  </span>
                  <h6>Reservation Phone</h6>
                  <p>
                    <a className="text-lowercase" href="tel:9717170578">+91 97171 70578</a>
                  </p>
                </div>
              </div>
              <div className="col-12 col-lg-4 col-sm-4">
                <div className="item">
                  <span className="icon feature_box_col_two">
                    <FontAwesomeIcon icon={faGlobe} />
                  </span>
                  <h6>Address:</h6>
                  <p>46, Old Judicial Complex Civil Lines Rd,
Sector 15, Gurugram, Haryana - 122001, India</p>
                </div>
              </div>
              <div className="col-12 col-lg-4 col-sm-4">
                <div className="item">
                  <span className="icon feature_box_col_three">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <h6>Reservation Email</h6>
                  <p>
                    <a className="text-lowercase" href="mailto:centralreservations@theclarkshotels.com">centralreservations@theclarkshotels.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="contact_frm sec-padding bg-light">
        <div className="container-md">
          <div className="row shadow p-3 rounded-lg">
            <div className="col-lg-7 col-md-7 px-5 py-0 rounded-3">
              <form className="row mb-3">
                <div className="col-md-6">
                  <input name="name" required
                    placeholder="Name"
                    type="text"
                    className={`w-full p-2 border form-control`} />
                </div>
                
                <div className="col-md-6">
                  <input name="email"
                    required placeholder="E-mail"
                    type="email"
                    className={`w-full p-2 border form-control`}
                  />
                </div>
                <div className="col-md-6">
                  <input name="phone"
                    required placeholder="Phone"
                    type="tel"
                    className={`w-full p-2 border form-control`}
                  />
                </div>
                <div className="col-md-6">
                  <input name="subject"
                    required
                    placeholder="Subject"
                    type="text"
                    className={`w-full p-2 border form-control`}
                  />
                </div>
                <div className="col-md-12">
                  <textarea name="message"
                    required
                    placeholder="Write your message"
                    cols={30} rows={3}
                    className={`w-full p-2 border form-control`}
                  />
                </div>
                <div className="text-center mt-2 submit-contact-us">
                  <button className="btn px-4 py-2 text-white btn-outline-dark book-now" type="submit" value="Submit" >
                  SUBMIT</button>
                </div>
              </form>
            </div>
            <div className="col-lg-5 ps-0 col-md-5 col-sm-12">
              <div className="inner-column wow fadeInLeft">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.721251251402!2d77.0338518!3d28.457818099999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d184816395391%3A0xb12c8ec92e20993d!2sDS%20Clarks%20Inn%20Gurgaon!5e0!3m2!1sen!2sin!4v1753265968194!5m2!1sen!2sin" width="100%" height="300"></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default HotelContactUs;