<template>
  <div>
    <div class="perMissonManger">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input
        size="small"
        placeholder="请输入角色中文名"
        v-model="role.nameZh"
        @keydown.enter.native="doAddRole"
      ></el-input>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="doAddRole"
        >添加角色</el-button
      >
    </div>
    <div class="permissonMain">
      <el-collapse v-model="activeName" accordion @change="change">
        <el-collapse-item
          :title="r.nameZh"
          :name="r.id"
          v-for="(r, index) in roles"
          :key="index"
        >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可以访问的资源 </span>
              <el-button
                style="float: right; padding: 3px 0; color: #ff0000"
                type="text"
                icon="el-icon-delete"
                @click="deleteRole(r)"
              ></el-button>
            </div>
            <div>
              <el-tree
                ref="tree"
                :key="index"
                show-checkbox
                node-key="id"
                :default-checked-keys="selectedMenus"
                :data="allmenus"
                :props="defaultProps"
              ></el-tree>
              <div style="display: flex; justify-content: flex-end">
                <el-button size="mini" @click="cancelUpdate"
                  >取消修改</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="doUpdate(r.id, index)"
                  >确认修改</el-button
                >
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissMana",
  data() {
    return {
      activeName: "1",
      roles: [],
      role: {
        name: "",
        nameZh: "",
      },
      allmenus: [],
      selectedMenus: [],
      activeName: "-1",
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    deleteRole(role) {
      this.$confirm(
        "此操作将永久删除【" + role.nameZh + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest("/system/basic/permiss/role/" + role.id).then(
            (resp) => {
              if (resp) {
                this.initRoles();
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    change(rid) {
      if (rid) {
        this.initAllMenus();
        this.initSelectedMenus(rid);
      }
    },
    initSelectedMenus(rid) {
      this.getRequest("/system/basic/permiss/mids/" + rid).then((resp) => {
        if (resp) {
          this.selectedMenus = resp;
        }
      });
    },
    initAllMenus() {
      this.getRequest("/system/basic/permiss/menus").then((resp) => {
        if (resp) {
          this.allmenus = resp;
        }
      });
    },
    initRoles() {
      this.getRequest("/system/basic/permiss/").then((resp) => {
        if (resp) {
          this.roles = resp;
        }
      });
    },
    doUpdate(rid, index) {
      let tree = this.$refs.tree[index];
      //传true只返回叶子节点
      let selectedtree = tree.getCheckedKeys(true);
      let url = "/system/basic/permiss/?rid=" + rid;
      selectedtree.forEach((element) => {
        url += "&mids=" + element;
      });
      this.putRequest(url).then((resp) => {
        if (resp) {
          this.activeName = -1;
        }
      });
    },
    cancelUpdate() {
      this.activeName = -1;
    },
    doAddRole() {
      if (this.role.name && this.role.nameZh) {
        this.postRequest("/system/basic/permiss/role", this.role).then(
          (resp) => {
            if (resp) {
              this.role.name = "";
              this.role.nameZh = "";
              this.initRoles();
            }
          }
        );
      } else {
        this.$message.error("请输入全部字段");
      }
    },
  },
};
</script>
<style >
.perMissonManger {
  display: flex;
  justify-content: flex-start;
}
.perMissonManger .el-input {
  width: 300px;
  margin-right: 6px;
}
.permissonMain {
  margin-top: 10px;
  width: 700px;
}
</style>