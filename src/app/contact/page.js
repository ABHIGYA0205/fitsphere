'use client';
import './contact.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2"

export default function ContactPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
    } else {
      setReady(true);
    }
  }, [session, status, router]);

  if (!ready || status === 'loading') return null;

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key","083d7505-74b1-492b-986d-93d4195bf802");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
    });
    const result = await response.json();
    if (result.success) {
        Swal.fire({
          title: "Success!",
          text: "Your message has been sent successfully!",
          icon: "success",
          draggable:true,
        })
        event.target.reset();
    }
}


  return (
    <div className="contact-container" data-aos="zoom-out">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-text">Have a question or feedback? We&apos;d love to hear from you.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" placeholder="Your Name" name='name' required/>

        <label>Email:</label>
        <input type="email" placeholder="you@example.com" name='email' required/>

        <label>Message:</label>
        <textarea placeholder="Type your message here..." name="message"   required></textarea>

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}
