'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { postAPI } from '../../lib/api/api';
import Image from 'next/image';
import Link from 'next/link';
import MainHeader from "../Common/MainHeader";
import { ChevronRight } from 'lucide-react';
import "../Styles/inner-hero.css";
import Footer from '../Common/Footer';

export default function CareerPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    resume: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // FRONTEND VALIDATION
  const { name, phone, email, resume } = formData;

  if (!name || !phone || !email || !resume) {
    toast.error("All fields are required.");
    return;
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  if (!phoneRegex.test(phone)) {
    toast.error("Enter a valid 10-digit phone number.");
    return;
  }

  if (!emailRegex.test(email)) {
    toast.error("Enter a valid email address.");
    return;
  }

  if (resume.size > 5 * 1024 * 1024) { // 5 MB limit
    toast.error("Resume file size should be under 5MB.");
    return;
  }

  if (!allowedTypes.includes(resume.type)) {
    toast.error("Only PDF, DOC, and DOCX files are allowed.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    const base64Resume = reader.result.split(',')[1];

    const payload = {
      subject: 'Career',
      name,
      phone,
      email,
      resume: base64Resume,
    };

    console.log('Submitted Form Data:', payload);

    try {
      setLoading(true);
      const res = await postAPI('sendcareerenquiry', payload);

      // BACKEND VALIDATION MESSAGE HANDLING
      if (res?.success) {
        toast.success(res.message || 'Form submitted successfully!');
        setFormData({ name: '', phone: '', email: '', resume: null });
        e.target.reset();
      } else {
        toast.error(res?.message || 'Submission failed from server.');
      }
    } catch (err) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  reader.readAsDataURL(resume);
};

  return (
    <>
      <MainHeader />
      <section className="hero-section-inner">
        <Image src="/img/career-banner.jpg" alt="Career Hero Image" height={500} width={1500} className="w-100 inner-hero-image" />
        <div className="inner-hero-content">
          <div className="text-center">
            <h2 className="inner-banner-heading">Careers</h2>
            <nav aria-label="breadcrumb" className="banner-breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link><ChevronRight />
                </li>
                <li className="breadcrumb-item active" aria-current="page">Careers</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="privacy-policy-page section-padding">
        <div className="container">
          <div className='row justify-content-center'>
            <div className='col-md-6 align-self-center'>
                <div className='heading-style-2'>
                    <h1 className="mb-4 global-heading">Careers</h1>
                </div>
                <p className='text-justify'>{"As India's fastest expanding hospitality brand, we're always on the lookout for great talent for our operating and upcoming hotels. To find suitable opportunities, please fill-up the form below and submit your resume. We will contact you as and when a suitable opportunity arises."} </p>
            </div>
            <div className='col-md-6'>
                <div className='career-form'>
                    <form onSubmit={handleSubmit} className='row'>
                        <div className="mb-3 col-md-6">
                        <label className="form-label">Full Name</label>
                        <input type="text" name="name" className="form-control" required onChange={handleChange} />
                        </div>
                        <div className="mb-3 col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input type="phone" name="phone" className="form-control" required onChange={handleChange} />
                        </div>
                        <div className="mb-3 col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" required onChange={handleChange} />
                        </div>
                        <div className="mb-3 col-md-6">
                        <label className="form-label">Upload Resume</label>
                        <input type="file" name="resume" className="form-control" accept=".pdf,.doc,.docx" required onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn btn-primary form-submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </>
  );
}
