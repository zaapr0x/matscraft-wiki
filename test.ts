import fetch from "node-fetch";

const response = await fetch(
  "https://api.drip.re/api/v4/realms/6728c5f8eddb398453f0544e/members/1190194345295482952",
  {
    headers: {
      Authorization:
        "Bearer c4863738d3d76fc81b59b41ec7654ea7dd5315c9a3d87f389de872bbec21e77f9189e8dbb9943c3a77c953af1f071689fc99db34470fadee9f49413ae2d5bc27",
    },
  }
);
const data = await response.json();

console.log(data);
