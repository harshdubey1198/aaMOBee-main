import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const CartModal = ({
  showCart,
  setShowCart,
  cart,
  selectedOffer,
  setSelectedOffer,
  currencySymbol,
  handlePlanSelection,
  userCountry,
}) => {
  const calculateSavings = (original, discounted) => {
    if (original === discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  // console.log("cartdata : ", cart);

  return (
    <>
      <style jsx>{`
        .cart-modal .modal-content {
          border: none;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .cart-modal .modal-header {
          background: linear-gradient(135deg, #0c424e 0%, #0c424e 100%);
          color: white;
          border: none;
          padding: 24px 30px;
          position: relative;
        }

        .cart-modal .modal-header::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at 30% 40%,
            rgba(255, 255, 255, 0.2) 0%,
            transparent 50%
          );
          pointer-events: none;
        }

        .cart-modal .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 1;
        }

        .cart-modal .btn-close {
          filter: brightness(0) invert(1);
          opacity: 0.8;
          transition: all 0.2s ease;
        }

        .cart-modal .btn-close:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        .cart-modal .modal-body {
          padding: 30px;
          background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
        }

        .offer-selection-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 20px;
          text-align: center;
        }

        .offer-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .offer-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(102, 126, 234, 0.1),
            transparent
          );
          transition: left 0.5s;
        }

        .offer-card:hover::before {
          left: 100%;
        }

        .offer-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
        }

        .offer-card.selected {
          border-color: #667eea;
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.05) 0%,
            rgba(118, 75, 162, 0.05) 100%
          );
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
        }

        .offer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .offer-details {
          flex: 1;
        }

        .offer-duration {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 4px;
        }

        .offer-pricing {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .current-price {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0c424e;
        }

        .original-price {
          font-size: 1rem;
          color: #a0aec0;
          text-decoration: line-through;
          font-weight: 500;
        }

        .savings-badge {
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .selected-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #0c424e, #0c424e);
          color: white;
          border-radius: 50%;
          font-weight: 700;
          font-size: 1.2rem;
          animation: checkmarkBounce 0.3s ease-out;
        }

        @keyframes checkmarkBounce {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .subtotal-section {
          margin-top: 30px;
          padding: 24px;
          background: white;
          border-radius: 16px;
          border: 2px solid rgba(102, 126, 234, 0.1);
          position: relative;
          overflow: hidden;
        }

        .subtotal-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.02) 0%,
            rgba(118, 75, 162, 0.02) 100%
          );
          pointer-events: none;
        }

        .subtotal-content {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .subtotal-label {
          font-size: 1.2rem;
          font-weight: 600;
          color: #4a5568;
        }

        .subtotal-amount {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #0c424e, #0c424e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cart-modal .modal-footer {
          border: none;
          padding: 0 30px 30px;
          background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
        }

        .continue-btn {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #0c424e 0%, #0c424e 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .continue-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0c424e 0%, #0c424e 100%);
          transition: left 0.3s ease;
          z-index: -1;
        }

        .continue-btn:hover::before {
          left: 0;
        }

        .continue-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px #0c424e;
        }

        .continue-btn:active {
          transform: translateY(-1px);
        }

        .modal-backdrop {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
        }

        @media (max-width: 768px) {
          .cart-modal .modal-dialog {
            margin: 20px;
          }

          .cart-modal .modal-header,
          .cart-modal .modal-body,
          .cart-modal .modal-footer {
            padding-left: 20px;
            padding-right: 20px;
          }

          .offer-card {
            padding: 16px;
          }

          .offer-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .selected-indicator {
            align-self: flex-end;
          }

          .subtotal-amount {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <Modal
        isOpen={showCart}
        toggle={() => setShowCart(false)}
        size="md"
        className="modal-dialog-centered cart-modal"
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader toggle={() => setShowCart(false)}>
          <div className="modal-title">
            {cart?.title} Plan
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 400,
                marginTop: "4px",
                opacity: 0.9,
              }}
            >
              {cart?.caption}
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="offer-selection-title">
            Choose Your Subscription Period
          </div>

          {cart?.prices[0]?.offers?.map((offer) => {
            const savings = calculateSavings(
              offer.originalPrice,
              offer.discountedPrice
            );

            return (
              <div
                key={offer._id}
                onClick={() => {
                  setSelectedOffer(offer);
                  localStorage.setItem("planPrice", offer.discountedPrice);
                }}

                className={`offer-card ${
                  selectedOffer?._id === offer._id ? "selected" : ""
                }`}
              >
                <div className="offer-content">
                  <div className="offer-details">
                    <div className="offer-duration">
                      {offer.durationValue} {offer.durationType}
                      {offer.durationType === "custom" ? " months" : ""}
                    </div>

                    <div className="offer-pricing">
                      <span className="current-price">
                        {currencySymbol}
                        {offer.discountedPrice}
                        {offer.durationType === "monthly" ? "/mo" : ""}
                        {offer.durationType === "yearly" ? "/yr" : ""}
                        {offer.durationType === "custom"
                          ? `/${offer.durationValue}mo`
                          : ""}
                      </span>

                      {offer.originalPrice !== offer.discountedPrice && (
                        <>
                          <span className="original-price">
                            {currencySymbol}
                            {offer.originalPrice}
                            {offer.durationType === "monthly" ? "/mo" : ""}
                            {offer.durationType === "yearly" ? "/yr" : ""}
                            {offer.durationType === "custom"
                              ? `/${offer.durationValue}mo`
                              : ""}
                          </span>

                          {savings > 0 && (
                            <span className="savings-badge">
                              Save {savings}%
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {selectedOffer?._id === offer._id && (
                    <div className="selected-indicator">✓</div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="subtotal-section">
            <div className="subtotal-content">
              <span className="subtotal-label">Total Amount:</span>
              <span className="subtotal-amount">
                {currencySymbol}
                {selectedOffer?.discountedPrice || 0}
              </span>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            className="continue-btn"
            onClick={() => {
              if (selectedOffer?.discountedPrice) {
                localStorage.setItem("planPrice", selectedOffer.discountedPrice);
              }
              localStorage.setItem("planId", cart._id);

              handlePlanSelection(cart._id, selectedOffer?.discountedPrice);
              setShowCart(false);
            }}
            disabled={!selectedOffer}
          >
            Continue to Checkout
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CartModal;
