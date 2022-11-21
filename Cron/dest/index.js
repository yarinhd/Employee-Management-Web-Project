"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.json = void 0;
const cron_1 = __importDefault(require("cron"));
const node_fetch_1 = __importDefault(require("node-fetch"));
console.log("aaaaaaaaaa");
const json = (response) => {
  console.log(response.json());
};
exports.json = json;
const job = new cron_1.default.CronJob(
  "* * * * * *",
  function () {
    console.log("You will see this message every second");
    (0, node_fetch_1.default)(
      "http://localhost:5000/api/user/62f04301935988185ee1ca48",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          cookie:
            "jwtCookie=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0X3h4eF9oIiwiaWF0IjoxNjYwMTIwNzAxNDEzLCJleHAiOjE2NjAxMjY3MDE0MTN9.uyxkD1BpC9yzqGWFwytFlXgcu2EiiHxjmjL4Y20VP0GGUsyuYHV74Admadi40gb8smFkbeiRB0HNPatXttzOMXJ-osvTMZ4KqpzKb7yiKI0cKcc0tQUmZpzDzhI5Q3PHqoBm2ul5KoFysJJ-hZ3TbZv9d6BwaWl-UoerglMvOwN-EZB8JdfpXtrb39uCsmbaUnimR3C4srOoqtqmpoRko2Wpu0zqMkbCIv4tyoYD44Nwjw9Me1Nh20FZaZBDSTAVAED1LMYPHwTSTNmlhjyraQTu--48tBvSY6yc6hPIF_yFL0i8xMZ9xEodFHONZ7OV9T8UoE7qUy5pTTg1Y9MD9BrCJlOdAxdPhniY04MZajc6FE7qf2CYsgg7a9JqWyic03lTSp_4PXSa1ZwzunnHiG2bnryt0QlDHVlxc_7SdlTnNfuzmmsD-gxE_92-vcu2Pq3KaIcQhJcTAYhQ6TxsBNS1gQtZXGYHbL4b_DBPMl4pSvqd0bCHdY27Gu7f-IGmz-IzKMNuAatJvZqkdjCYE4Zivc10AstVGDXn_0hw2lcUSDRQwxIgAnrbPLlK7nn6slj8y4GJY7u0tjo8jX9RbvnFZMlKQJ4tDvPPO9e_1H2WXDteCme5CP58JH0S5Z5-W3aIC-fumoBexk5VRMgFEu1jeAEP_qq_v6GeTfDVi6o",
        },
      }
    ).then(exports.json);
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();
