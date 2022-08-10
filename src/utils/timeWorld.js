export function timeWorld(continent, capital) {
  return fetch(`http://worldtimeapi.org/api/timezone/${continent}/${capital}`)
    .then((time) => time.json())
    .catch((e) => console.error(e));
}
export function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}
//
// const url = "https://worldtimeapi.org/api/timezone/";

// export const getTimeOffset = async (zone) => {
//   try {
//     await fetch(url + zone).then((res) => res.utc_offset);
//   } catch (e) {
//     throw new Error(e);
//   }
// };
