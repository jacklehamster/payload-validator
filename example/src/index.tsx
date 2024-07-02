// To recognize dom types (see https://bun.sh/docs/typescript#dom-types):
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import React from "react";
import { StrictMode, useState, useMemo, useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { signedPayload, validatePayload } from "@dobuki/payload-validator";

const div = document.body.appendChild(document.createElement("div"));

const HelloComponent = function () {
  const [data, setData] = useState("");
  const [secret, setSecret] = useState("");
  const [payload, setPayload] = useState("{}");

  const updatePayloadSignature = useCallback(() => {
    setPayload(JSON.stringify(signedPayload({
      data: data,
    } as any, {secret}), null, "\t"));
  }, [data, secret])

  const isValidSignature = useMemo(() => {
    try {
      return validatePayload(JSON.parse(payload), {secret});
    } catch (e) {
      return false;
    }
  }, [payload, secret]);

  useEffect(() => {
    setPayload(previousPayload => JSON.stringify({...JSON.parse(previousPayload), data}, null, "\t"));
  }, [data]);

  useEffect(() => {
    updatePayloadSignature();
  }, []);

  const code = useMemo(() => {
return `
    const payload = {
      data: "${data}"
    };

    const payloadWithSignature = signedPayload(payload, "${secret}");

    //  ... send payloadWithSignature to receiver

    const isValid = validatePayload(payloadWithSignature, "${secret}");
`;
  }, [data, secret]);

  return <>
    <div>
      <label htmlFor="data" style={{ marginRight: 8 }}>Original data</label>
      <input id="data" type="text" onInput={e => setData(e.currentTarget.value)} value={data}></input>
    </div>
    <div>
      <label htmlFor="secret" style={{ marginRight: 8 }}>Secret</label>
      <input id="secret" type="text" onInput={e => setSecret(e.currentTarget.value)} value={secret}></input>
    </div>
    <div>
      <button type="button" onClick={updatePayloadSignature}>Update payload signature</button>
    </div>
    <div>
      <label htmlFor="textarea">Signed payload:</label>
      <textarea id="textarea" style={{ width: 800, height: 200 }} value={payload} onChange={e => setPayload(e.currentTarget.value)}></textarea>
    </div>
    <div>
      <label htmlFor="valid">IsValidSignature:</label>
      <div id="valid">{isValidSignature ? <span style={{color: "green"}}>valid</span> : <span style={{color: "red"}}>invalid</span>}</div>
    </div>
    <br></br>
    <div style={{ whiteSpace: "pre" }}>
      <label htmlFor="code">Code:</label>
      <div id="code" style={{ border: "1px solid black" }}>{code}</div>
    </div>
  </>;
}

//  HelloComponent
const root = createRoot(div);
root.render(location.search.indexOf("strict-mode") >= 0 ?
  <StrictMode>
    <HelloComponent />
  </StrictMode> : <HelloComponent />
);

export {};
