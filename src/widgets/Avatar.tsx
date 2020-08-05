// SPDX-FileCopyrightText: © 2017 EteSync Authors
// SPDX-License-Identifier: AGPL-3.0-only

import * as React from "react";

export const Avatar = React.memo((props: { children: React.ReactNode[] | React.ReactNode, size?: number, style?: any }) => {
  const size = (props.size) ? props.size : 40;

  return (
    <div
      style={{
        backgroundColor: "grey",
        color: "white",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        height: size,
        width: size,
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
});
