export default function WhatsAppWidget() {
  const phoneNumber = "+256777676206";
  const message = "Hello! I'd like to get in touch with Oroma TV.";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <div className="whatsapp-widget">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
        aria-label="Contact us on WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
}
