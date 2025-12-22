import React from "react";
import { Col, Input, Label, Button } from "reactstrap";

const LayoutSelector2 = ({
  type,
  layoutOptions = [],
  selectedLayout,
  onChangeLayout,
  onPreviewLayout,
  previewButtonLabel = "Preview",
}) => {
  return (
    <Col md={12}>
      <style>
        {`
          .layout-options-wrapper {
            gap: 40px;
          }

          @media (max-width: 1025px) {
            .layout-options-wrapper {
              gap: 24px !important;
            }
          }

          @media (max-width: 768px) {
            .layout-options-wrapper {
              flex-direction: column;
              align-items: flex-start;
              gap: 16px !important;
            }
          }

          .layout-radio-wrapper {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 10px 16px;
            transition: all 0.2s ease;
            background-color: #f8f9fa;
          }

          .layout-radio-wrapper:hover {
            background-color: #f1f3f5;
            border-color: #ced4da;
          }

          .layout-radio-wrapper input[type="radio"] {
            margin-right: 8px;
            accent-color: #0d6efd;
          }
        `}
      </style>

      <div className="mb-3">
        <Label className="fw-bold text-capitalize mb-2 d-block">
          {type} Layouts:
        </Label>

        <div className="d-flex flex-wrap align-items-start layout-options-wrapper">
          {layoutOptions.map((layout) => (
            <div
              key={layout.id}
              onClick={() => {
                onPreviewLayout(layout.id);
                onChangeLayout(type, layout.id);
              }}
              className={`layout-box-wrapper d-flex align-items-center justify-content-between flex-wrap mb-2 p-3 border rounded cursor-pointer ${selectedLayout === layout.id ? 'border-primary bg-light shadow-sm' : 'border-light'
                }`}
              style={{ transition: 'all 0.2s ease-in-out' }}
            >
              <div className="d-flex align-items-center">
                <div
                  className="layout-label-box fw-bold"
                  style={{ fontSize: "16px" }}
                >
                  {layout.label}
                </div>
              </div>

              <Button
                size="sm"
                color="primary"
                className="ms-2 px-3 py-1 text-white bg-primary border-0 shadow-sm"
                style={{
                  fontWeight: 500,
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  backgroundColor: '#0d4d4d', // dark teal (match theme)
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  onPreviewLayout(layout.id);
                  onChangeLayout(type, layout.id);
                }}
              >
                {previewButtonLabel}
              </Button>

            </div>
          ))}


        </div>
      </div>
    </Col>
  );
};

export default LayoutSelector2;
