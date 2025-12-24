import React, { useCallback, memo } from 'react';
import heartImage from '../assets/heart image.webp';
import friendsImage from '../assets/friends.webp';
import documentTabletImage from '../assets/document-tablet.webp';
import ladyImage from '../assets/lady.webp';
import { Link } from "react-router-dom";

function Starter() {
  const handleScrollToProducts = useCallback(() => {
    window.scrollToProducts?.();
  }, []);

  return (
    <div id="starter" className="starter" /* let the browser skip work until visible */
         style={{ contentVisibility: 'auto', containIntrinsicSize: '1200px' }}>
      <div className="ut-box">
        <div className="row">
          <div className="col-md-6">
            <div className="box1">
              <div className="box-content">
                <h4>No Tech Skills? No Problem</h4>
                <p>Stop worrying about complicated software. aaMOBee is built for busy shop owners who’ve never used digital billing before.</p>
                <ul className="tick-list">
                  <li>Generate GST bills in seconds</li>
                  <li>Track stock without confusion</li>
                  <li>See daily profit without calculations</li>
                </ul>
                <p>If you can run your shop, you can run aaMOBee. It’s that simple.</p>
                <p>
                  Explore our{" "}
                  <Link to="/inventory-management-software" style={{ color: "#faa624" }}>
                    inventory management software for small business
                  </Link>{" "}
                  to manage stock effortlessly.
                </p>
                <span className="href-starter" onClick={handleScrollToProducts}
                      style={{ display: "block", cursor: "pointer" }}>
                  ➡️ Start Without Any Training
                </span>
                <img
                  className="boxify-img1"
                  src={heartImage}
                  alt="Heart icon"
                  loading="lazy"
                  decoding="async"
                  /* set real intrinsic dimensions if you know them */
                  width="512" height="512"
                  sizes="(max-width: 768px) 45vw, 30vw"
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="box2">
              <div className="box-content top">
                <h4>Setup Help From Real People</h4>
                <p>Switching systems feels scary, but you’re never alone.</p>
                <ul className="tick-list">
                  <li>One-on-one onboarding calls</li>
                  <li>WhatsApp support in Hindi, English, and regional languages</li>
                  <li>Step-by-step guidance to send your first bill</li>
                </ul>
                <p>No waiting days for replies. Our team responds quickly because your shop can’t wait.</p>
                <span className="href-starter" onClick={handleScrollToProducts}
                      style={{ display: "block", textAlign: "center", cursor: "pointer" }}>
                  ➡️ Get Personalised Setup Help
                </span>
                <img
                  className="boxify-img2"
                  src={friendsImage}
                  alt="Friends illustration"
                  loading="lazy"
                  decoding="async"
                  width="768" height="512"
                  sizes="(max-width: 768px) 45vw, 30vw"
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="box3">
              <div className="box-content">
                <h4>Built For Shops Like Yours</h4>
                <p>aaMOBee isn’t made for big companies with IT teams. It’s made for kirana shops, pharmacies, clothing stores, and boutiques who want:</p>
                <ul className="tick-list">
                  <li>Quick GST billing</li>
                  <li>Automatic stock updates</li>
                  <li>Daily profit and sales reports</li>
                </ul>
                <p>No complex dashboards or confusing menus - only the tools you need to run your shop smoothly.</p>
                <p className='left'>
                  Discover our easy-to-use{" "}
                  <Link to="/apps/retail-billing" style={{ color: "#faa624" }}>
                    retail billing software
                  </Link>{" "}
                  for your store today.
                </p>
                <span className="href-starter" onClick={handleScrollToProducts}
                      style={{ display: "block", cursor: "pointer" }}>
                  ➡️ See How It Works For Shops
                </span>
                <img
                  className="boxify-img3"
                  src={documentTabletImage}
                  alt="Document and tablet icon"
                  loading="lazy"
                  decoding="async"
                  width="768" height="512"
                  sizes="(max-width: 768px) 45vw, 30vw"
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="box4">
              <div className="box-content">
                <h4 style={{ textAlign: "center" }}>Start Billing in Under 15 Minutes</h4>
                <p style={{ textAlign: "center" }}>You don’t need engineers or special training.</p>
                <ul className="tick-list">
                  <li>Sign up, add products, start billing</li>
                  <li>No installations—works on any laptop or phone browser</li>
                  <li>Full support available if needed</li>
                </ul>
                <p>Join 10,000+ shop owners who started billing customers within their first hour.</p>
                <p className='right'>
                  Start sending GST-ready bills with our{" "}
                  <Link to="/apps/invoicing" style={{ color: "blue" }}>
                    invoice software
                  </Link>{" "}
                  in minutes.
                </p>
                <span className="href-starter" onClick={handleScrollToProducts}
                      style={{ display: "block", textAlign: "center", cursor: "pointer" }}>
                  ➡️ Try It Now – It’s That Easy
                </span>
                <img
                  className="boxify-img4"
                  src={ladyImage}
                  alt="Lady illustration"
                  loading="lazy"
                  decoding="async"
                  width="640" height="640"
                  sizes="(max-width: 768px) 45vw, 30vw"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default memo(Starter);
