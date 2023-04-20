import cron from "cron";
import fetch from "node-fetch";

export const json: (response: any) => Promise<any> = (response: any) =>
  response.json();

export const handleErrors: (response: any) => any = (response: any) => {
  if (!response.ok) {
    throw response.status;
  }
  return response;
};

export const fetchBranches: () => Promise<any> = () => {
  return fetch(`http://localhost:5000/api/group/allBranch/cronRoute`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(handleErrors)
    .then(json);
};

export const fetchUpdateBranches: (branchName: string) => Promise<any> = (
  branchName: string
) => {

  return fetch(
    `http://localhost:5000/api/user/cronUpsertBranch/${branchName}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then(handleErrors)
    .then(json);
};

const job = new cron.CronJob(
  "00 00 00 * * *",
  async function () {

    const branchNames: string[] = await fetchBranches();

    const branchUpdated = await Promise.all(
      branchNames.map((branchName) => fetchUpdateBranches(branchName))
    );
  },
  null,
  true,
  "Asia/Jerusalem"
);

job.start();
