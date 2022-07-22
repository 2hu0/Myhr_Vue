<template>
  <div>
    <el-input
      placeholder="输入部门名称进行搜索"
      prefix-icon="el-icon-search"
      v-model="filterText"
    >
    </el-input>

    <el-tree
      :data="deps"
      :props="defaultProps"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      ref="tree"
    >
      <span
        class="custom-tree-node"
        style="display: flex; justify-content: space-between; width: 100%"
        slot-scope="{ node, data }"
      >
        <span>{{ node.label }}</span>
        <span>
          <el-button
            class="depButton"
            type="primary"
            size="mini"
            @click="() => showAddDepView(data)"
          >
            添加部门
          </el-button>
          <el-button
            class="depButton"
            type="danger"
            size="mini"
            @click="() => deleteDep(node.data)"
          >
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog title="添加部门" :visible.sync="dialogVisible" width="30%">
      <div>
        <table>
          <tr>
            <td>
              <el-tag>上级部门</el-tag>
            </td>
            <td>
              <span style="padding-left: 10px">{{ pname }}</span>
            </td>
          </tr>
          <tr>
            <td><el-tag>部门名称</el-tag></td>
            <td>
              <el-input
                v-model="dep.name"
                placeholder="请输入部门名称"
              ></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddDep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      dialogVisible: false,
      filterText: "",
      deps: [],
      dep: {
        name: "",
        parentId: -1,
      },
      pname: "",
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.initDeps();
  },
  methods: {
    addDep2Deps(deps, dep) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == dep.parentId) {
          d.children = d.children.concat(dep);
          if (d.children > 0) {
            d.parent = true;
          }
          return;
        } else {
          this.addDep2Deps(d.children, dep);
        }
      }
    },
    initDep() {
      this.dep = {
        name: "",
        parentId: -1,
      };
      this.pname = "";
    },
    doAddDep() {
      this.postRequest("/system/basic/department/", this.dep).then((resp) => {
        if (resp) {
          this.addDep2Deps(this.deps, resp.object);
          this.dialogVisible = false;
          this.initDep();
        }
      });
    },
    showAddDepView(data) {
      this.pname = data.name;
      (this.dep.parentId = data.id), (this.dialogVisible = true);
    },
    removeDepFromDeps(p, deps, id) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == id) {
          deps.splice(i, 1);
          if (deps.length == 0) {
            p.parent = false;
          }
          return;
        } else {
          this.removeDepFromDeps(d, d.children, id);
        }
      }
    },
    deleteDep(data) {
      console.log(data);
      if (data.isParent) {
        this.$message.error("父部门不可删除");
      } else {
        this.$confirm(
          "此操作将永久删除【" + data.name + "】, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.deleteRequest("/system/basic/department/" + data.id).then(
              (resp) => {
                if (resp) {
                  this.removeDepFromDeps(null, this.deps, data.id);
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
      }
    },
    initDeps() {
      this.getRequest("/system/basic/department/").then((resp) => {
        if (resp) {
          this.deps = resp;
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
  },
};
</script>
<style >
.depButton {
  padding: 2px;
}
</style>