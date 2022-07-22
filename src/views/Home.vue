<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">青云人事</div>
    <div>
      <el-button icon="el-icon-bell" type="text" style="margin-right:8px;color: #000000" @click="goChat"></el-button>
          <el-dropdown class="userInfo" @command="commandHandler">
          <span class="el-dropdown-link">
            {{ user.name }}<i><img :src="user.userface" alt="" /></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened>
            <el-submenu
              v-bind:index="index + ''"
              v-for="(item, index) in routes"
              v-if="!item.hidden"
              :key="index"
            >
              <template slot="title">
                <i
                  style="color: cadetblue; margin-right: 5px"
                  :class="item.iconCls"
                ></i>
                <span class="guide">{{ item.name }}</span>
              </template>
              <el-menu-item
                :index="child.path"
                v-for="(child, indexj) in item.children"
                :key="indexj"
                class="choice"
              >
                {{ child.name }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            v-if="this.$router.currentRoute.path != '/home'"
          >
            <el-breadcrumb-item :to="{ path: '/home' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>{{
              this.$router.currentRoute.name
            }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div
            class="homeWelcome"
            v-if="this.$router.currentRoute.path == '/home'"
          >
            欢迎使用青云人事管理系统!
          </div>
          <router-view class="routerView" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem("user")),
    };
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
  },
  methods: {
    goChat(){
      this.$router.push("/chat");
    },
    //index就是要跳转的地方
    // menuClick(index) {
    //   this.$router.push(index);
    // },
    commandHandler(cmd) {
      if (cmd == "logout") {
        this.$confirm("此操作将注销登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.getRequest("/logout");
            window.sessionStorage.removeItem("user");
            this.$store.commit("initRoutes", []);
            this.$router.replace("/");
            // this.$message({
            //   type: "success",
            //   message: "注销成功",
            // });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
      }
    },
  },
};
</script>

<style>
.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文行楷;
  color: cadetblue;
  padding-top: 50px;
}
.homeHeader {
  background-color: cadetblue;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
}
.homeHeader .title {
  font-size: 32px;
  font-family: 华文行楷;
  color: cornsilk;
}
.homeHeader .userInfo {
  cursor: pointer;
}
.el-dropdown-link {
  font-size: 20px;
  font-family: sans-serif;
  color: whitesmoke;
  display: flex;
  align-items: center;
}
.el-dropdown-link img {
  width: 56px;
  height: 55px;
  border-radius: 24px;
  margin-left: 8px;
}
/* 导航栏尺寸 */
.guide {
  font-size: 18px;
}
/* 选项尺寸 */
.choice {
  font-size: 16px;
}
.routerView {
  margin-top: 20px;
}
</style>
