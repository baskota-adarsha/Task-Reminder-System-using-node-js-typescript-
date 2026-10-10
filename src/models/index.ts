import { User } from "./user";
import { Task } from "./tasks";
User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

export { User, Task };
