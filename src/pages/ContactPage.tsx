import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { BUSINESS_INFO, FAQS } from '../data/equipment';
import { encodeFormUrlParams } from '../utils/rentalMath';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { FaqAccordion } from '../components/FaqAccordion';

interface ContactErrors {
  fullName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  message?: string;
}

export const ContactPage: React.FC = () => {
  useDocumentTitle(
    'Contact & FAQs',
    'Reach Vvichelae Event Rentals in Lagos, Nigeria via WhatsApp (08144084281), email (vvichelae@gmail.com), or our enquiry form.'
  );

  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#faq') {
      const el = document.getElementById('faq');
      if (el) {
        window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80);
      }
    }
  }, [location.hash]);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [eventType, setEventType] = useState('Wedding / Reception');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<{
    type: 'success' | 'preview' | 'error';
    text: string;
  } | null>(null);

  const validate = (): ContactErrors => {
    const next: ContactErrors = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name.';
    }
    const cleanedPhone = phoneNumber.replace(/[\s\-()]/g, '');
    if (!cleanedPhone || !/^\+?\d{7,15}$/.test(cleanedPhone)) {
      next.phoneNumber = 'Please enter a valid phone number.';
    }
    if (emailAddress.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())) {
      next.emailAddress = 'Please enter a valid email address.';
    }
    if (!message.trim() || message.trim().length < 10) {
      next.message = 'Please enter a brief message about your event or rental question.';
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitFeedback(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        'form-name': 'vvichelae-contact-enquiries',
        'full-name': fullName.trim(),
        'phone-number': phoneNumber.trim(),
        'email-address': emailAddress.trim() || 'Not provided',
        'event-type': eventType,
        message: message.trim(),
      };

      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormUrlParams(payload),
      });

      const host = window.location.hostname;
      const isLocalOrPreview =
        import.meta.env.DEV ||
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host.endsWith('.run.app');

      if (!res.ok) {
        setSubmitFeedback({
          type: 'error',
          text: 'The web form request could not be completed on this server. Please message us directly on WhatsApp (08144084281) or email vvichelae@gmail.com.',
        });
      } else if (isLocalOrPreview) {
        setSubmitFeedback({
          type: 'preview',
          text: 'Your message passed validation and posted to `/`, however Netlify Forms only captures submissions once deployed to Netlify. Please use WhatsApp or email directly in preview mode.',
        });
      } else {
        setSubmitFeedback({
          type: 'success',
          text: 'Thank you. Your enquiry has been submitted to Vvichelae Event Rentals. We will respond via phone or email shortly.',
        });
        setFullName('');
        setPhoneNumber('');
        setEmailAddress('');
        setMessage('');
      }
    } catch {
      setSubmitFeedback({
        type: 'error',
        text: 'Network error while submitting the contact form. Please try again or reach us directly on WhatsApp.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
      {/* Header + Contact Grid */}
      <div>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#245B59]/70">
            Get In Touch · {BUSINESS_INFO.location}
          </p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-[#245B59] tracking-tight">
            Contact Vvichelae Event Rentals
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#245B59]/80 leading-relaxed">
            Have a question about stock availability, delivery across Lagos, or multi-day event
            planning? Reach us directly on WhatsApp, send an email, or leave a note below.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Direct Business Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl bg-[#245B59] text-[#FFF9F0] p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#E8C994]">
                  Business Information
                </h2>
                <p className="mt-1.5 text-sm text-[#FFF9F0]/85">
                  Serving individuals, planners, decorators, and organisations across{' '}
                  {BUSINESS_INFO.serviceArea}.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#E8C994] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#E8C994]">WhatsApp</p>
                    <a
                      href={BUSINESS_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#FFF9F0] hover:text-[#E8C994] tabular-nums"
                    >
                      {BUSINESS_INFO.whatsappDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#E8C994] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#E8C994]">Email</p>
                    <a
                      href={`mailto:${BUSINESS_INFO.email}`}
                      className="font-semibold text-[#FFF9F0] hover:text-[#E8C994]"
                    >
                      {BUSINESS_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#E8C994] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#E8C994]">Location</p>
                    <p className="font-semibold text-[#FFF9F0]">{BUSINESS_INFO.location}</p>
                    <p className="text-xs text-[#FFF9F0]/80 mt-0.5">
                      Service area: {BUSINESS_INFO.serviceArea}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8C994]/25 space-y-3">
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E8C994] px-5 py-3 text-sm font-semibold text-[#245B59] hover:bg-[#FFF9F0] transition-colors min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Chat on WhatsApp ({BUSINESS_INFO.whatsappDisplay})</span>
                </a>
                <Link
                  to="/equipment"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8C994]/55 px-5 py-3 text-sm font-semibold text-[#FFF9F0] hover:border-[#E8C994] hover:bg-[#E8C994]/12 transition-colors min-h-[44px]"
                >
                  <span>Build a Rental Basket</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Contact Enquiry Form */}
          <div className="lg:col-span-7 rounded-xl border border-[#245B59]/12 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#245B59]">
              Send a General Enquiry
            </h2>
            <p className="mt-1.5 text-sm text-[#245B59]/80">
              For itemised equipment quotes with dates, use the{' '}
              <Link to="/basket" className="font-semibold text-[#245B59] underline decoration-[#E8C994] underline-offset-4">
                Rental Basket Calculator
              </Link>
              . For general questions, message us here.
            </p>

            <form
              name="vvichelae-contact-enquiries"
              method="POST"
              data-netlify="true"
              onSubmit={handleSubmit}
              noValidate
              className="mt-6 space-y-5"
            >
              <input type="hidden" name="form-name" value="vvichelae-contact-enquiries" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-[#245B59] mb-1.5"
                  >
                    Full Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] placeholder:text-[#245B59]/45 focus:border-[#245B59] focus:outline-none min-h-[44px]"
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#245B59]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs font-semibold text-[#245B59] mb-1.5"
                  >
                    Phone / WhatsApp Number <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone-number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0803 123 4567"
                    className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] placeholder:text-[#245B59]/45 focus:border-[#245B59] focus:outline-none min-h-[44px]"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#245B59]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.phoneNumber}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-[#245B59] mb-1.5"
                  >
                    Email Address (Optional)
                  </label>
                  <input
                    id="contact-email"
                    name="email-address"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] placeholder:text-[#245B59]/45 focus:border-[#245B59] focus:outline-none min-h-[44px]"
                  />
                  {errors.emailAddress && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#245B59]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.emailAddress}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-event-type"
                    className="block text-xs font-semibold text-[#245B59] mb-1.5"
                  >
                    Event Type
                  </label>
                  <select
                    id="contact-event-type"
                    name="event-type"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] focus:border-[#245B59] focus:outline-none min-h-[44px]"
                  >
                    <option value="Wedding / Reception">Wedding / Reception</option>
                    <option value="Birthday / Private Party">Birthday / Private Party</option>
                    <option value="Corporate Function">Corporate Function</option>
                    <option value="Traditional Ceremony">Traditional Ceremony</option>
                    <option value="General Rental Enquiry">General Rental Enquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-[#245B59] mb-1.5"
                >
                  Message <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your event date, Lagos venue area, or any questions..."
                  className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] placeholder:text-[#245B59]/45 focus:border-[#245B59] focus:outline-none"
                />
                {errors.message && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#245B59]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              {submitFeedback && (
                <div
                  role="status"
                  className={`rounded-lg border p-4 text-xs sm:text-sm flex items-start gap-2.5 ${
                    submitFeedback.type === 'success'
                      ? 'border-[#E8C994] bg-[#E8C994]/25 text-[#245B59]'
                      : 'border-[#245B59] bg-[#E8C994]/30 text-[#245B59]'
                  }`}
                >
                  {submitFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : submitFeedback.type === 'preview' ? (
                    <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <span>{submitFeedback.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#245B59] px-6 py-3 text-sm font-semibold text-[#FFF9F0] hover:bg-[#245B59]/90 transition-colors disabled:opacity-50 min-h-[44px] cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
                <span>{submitting ? 'Sending...' : 'Submit Contact Enquiry'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Full FAQ Section */}
      <section id="faq" className="pt-12 border-t border-[#245B59]/12">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#245B59]/70">
            Rental Answers
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#245B59] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#245B59]/80">
            Everything you need to know about selecting equipment, calculating multi-day costs,
            collection, delivery, and sending an enquiry.
          </p>
        </div>

        <FaqAccordion items={FAQS} />

        {/* Clear Rental Enquiry CTA */}
        <div className="mt-12 rounded-xl border border-[#E8C994] bg-white p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#245B59]">
              Ready to Calculate Your Event Rental?
            </h3>
            <p className="mt-1.5 text-sm text-[#245B59]/80">
              Add your chosen furniture, canopies, fabrics, or catering items to your Rental Basket
              and get an instant multi-day estimate.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/equipment"
              className="inline-flex items-center gap-2 rounded-lg bg-[#245B59] px-5 py-3 text-sm font-semibold text-[#FFF9F0] hover:bg-[#245B59]/90 transition-colors min-h-[44px]"
            >
              <span>Browse Equipment</span>
              <ArrowRight className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
            </Link>
            <Link
              to="/basket"
              className="inline-flex items-center rounded-lg border border-[#E8C994] bg-[#E8C994]/30 px-5 py-3 text-sm font-semibold text-[#245B59] hover:bg-[#E8C994] transition-colors min-h-[44px]"
            >
              Go to Rental Basket
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
