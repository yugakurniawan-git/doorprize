import { useState, useEffect } from "react";

export default function useUrlParams() {
  const [params, setParams] = useState(() => {
    const url = new URL(window.location.href.replace(/#/g, ""));
    return Object.fromEntries(url.searchParams);
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(params).toString();
    let currentUrl = window.location.href.replace(/#/g, "");
    const baseUrl = currentUrl.split("?")[0];
    currentUrl = urlParams ? `${baseUrl}?${urlParams}` : baseUrl;
    let currentPath = currentUrl.replace(window.location.origin, "");
    window.history.pushState({}, "", `/#${currentPath.substring(1)}`);
  }, [params]);

  return [params, setParams];
}
