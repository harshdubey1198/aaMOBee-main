import React from "react";
import { Col, Label, Button, Input, InputGroup, InputGroupText } from "reactstrap";

const LayoutSelector = ({
  type,
  layoutOptions = [],
  selectedLayout,
  onChangeLayout,
  onPreviewLayout,
  previewButtonLabel = "Preview",
}) => {
  const selectedLayoutObj = layoutOptions.find((l) => l.id === selectedLayout);

  return (
    <Col md={6} className="mb-4">
      <Label className="fw-bold text-capitalize mb-3 fs-5">
        {type} Layout Options
      </Label>

      <InputGroup>
        <Input
          type="select"
          value={selectedLayout}
          onChange={(e) => onChangeLayout(type, e.target.value)}
        >
          <option value="">-- Select Layout --</option>
          {layoutOptions.map((layout) => (
            <option key={layout.id} value={layout.id}>
              {layout.label}
            </option>
          ))}
        </Input>
{/* 
        <Button
          color="primary"
          onClick={() => onPreviewLayout(selectedLayout)}
          disabled={!selectedLayout}
        >
          {previewButtonLabel}
        </Button> */}
      </InputGroup>
    </Col>
  );
};

export default LayoutSelector;
