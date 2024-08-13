const { default: axios } = require("axios");
const { validateToken } = require("./CheckValidToken");

exports.mission = async () => {
  try {
    const token = await validateToken();

    for (const t of token) {
      const task = await axios.get(
        "https://game-domain.blum.codes/api/v1/tasks",
        {
          headers: {
            Authorization: `Bearer ${t.token}`,
          },
        }
      );
      const tasks = task.data;

      for (const i of tasks) {
        const taskNotStarted = i.tasks.filter(
          (item) =>
            item.status === "NOT_STARTED" && item.type !== "PROGRESS_TARGET"
        );

        if (taskNotStarted.length > 0) {
          for (const task of taskNotStarted) {
            try {
              await axios.post(
                `https://game-domain.blum.codes/api/v1/tasks/${task.id}/start`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${t.token}`,
                  },
                }
              );
              console.log(
                `[ Running ] : Claim ${task.title} successfully. Reward ${task.reward}`
              );
            } catch (error) {
              console.log(error.message);
            }
          }
        } else {
          console.log(`[ Completed ] : No task not started.`);
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.claimMission = async () => {
  try {
    const token = await validateToken();

    for (const t of token) {
      const task = await axios.get(
        "https://game-domain.blum.codes/api/v1/tasks",
        {
          headers: {
            Authorization: `Bearer ${t.token}`,
          },
        }
      );
      const tasks = task.data;

      for (const i of tasks) {
        const taskReadyToClaim = i.tasks.filter(
          (item) =>
            item.status === "READY_FOR_CLAIM" && item.type !== "PROGRESS_TARGET"
        );

        if (taskReadyToClaim.length > 0) {
          for (const task of taskReadyToClaim) {
            try {
              await axios.post(
                `https://game-domain.blum.codes/api/v1/tasks/${task.id}/claim`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${t.token}`,
                  },
                }
              );
              console.log(
                `[ Running ] : Claim ${task.title} successfully. Reward ${task.reward}`
              );
            } catch (error) {
              console.log(`[ Error ] : Claim mission failed. ${error.message}`);
            }
          }
        } else {
          console.log(`[ Completed ] : No task ready to claim.`);
        }
      }
    }
  } catch (error) {
    console.log(`[ Error ] : Claim mission failed. ${error.message}`);
  }
};
