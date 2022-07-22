<template>
  <div>
    <div>
      <el-input
        class="addPosInput"
        size="small"
        placeholder="添加职位..."
        prefix-icon="el-icon-plus"
        v-model="pos.name"
        @keydown.enter.native="addPosition"
      >
      </el-input>
      <el-button
        icon="el-icon-plus"
        size="small"
        type="primary"
        @click="addPosition"
        >添加</el-button
      >
    </div>
    <div class="posManaMain">
      <el-table
        :data="positions"
        border
        @selection-change="handleSelectionChange"
        stripe
        size="small"
        style="width: 70%"
        v-loading="loading"
        element-loading-text="正在登录中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号" width="55"> </el-table-column>
        <el-table-column prop="name" label="职位名称" width="150">
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="180">
        </el-table-column>
        <el-table-column label="是否启用" width="120">
          <template slot-scope="scope">
            <div style="text-align: center">
              <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
              <el-tag type="danger" v-else="scope.row.enabled">未启用</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作"
          ><template slot-scope="scope">
            <el-button
              size="mini"
              @click="showEditView(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template></el-table-column
        >
      </el-table>
      <el-button
        type="danger"
        size="small"
        style="margin-top: 8px"
        :disabled="multipleSelection.length == 0"
        @click="deleteMany"
        >批量删除</el-button
      >
    </div>
    <el-dialog title="修改职位" :visible.sync="dialogVisible" width="30%">
      <div>
        <div>
          <el-tag>职位名称</el-tag>
          <el-input
            class="updatePosInput"
            size="small"
            v-model="updatePos.name"
          ></el-input>
        </div>
        <div style="margin-top: 10px">
          <el-tag>是否启用</el-tag>
          <el-switch
            style="padding-top: 8px; padding-left: 8px"
            v-model="updatePos.enabled"
            active-text="启用"
            inactive-text="禁用"
            inactive-color="red"
          >
          </el-switch>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data() {
    return {
      loading: false,
      pos: {
        name: "",
      },
      positions: [],
      dialogVisible: false,
      multipleSelection: [],
      //更新过的数据
      updatePos: {
        name: "",
        enabled: "",
      },
    };
  },
  mounted() {
    this.initPositions();
  },
  methods: {
    addPosition() {
      if (this.pos.name) {
        this.postRequest("/system/basic/pos/", this.pos).then((resp) => {
          if (resp) {
            this.initPositions();
            this.pos.name = "";
          }
        });
      } else {
        this.$message.error("职位名称不可为空");
      }
    },
    doUpdate() {
      this.putRequest("/system/basic/pos/", this.updatePos).then((resp) => {
        if (resp) {
          this.initPositions();
          this.updatePos.name = "";
          this.dialogVisible = false;
        }
      });
    },
    showEditView(index, data) {
      //Object.assign()方法复制的是源对象的属性值，如果源对象的属性是指向另一个对象的引用，那么它只会复制这个引用值（浅复制），不会深复制这个引用值所引用的对象。
      Object.assign(this.updatePos, data);
      this.dialogVisible = true;
      // this.updatePos = data; 这样的话就深拷贝了  不行 这里要求的浅拷贝
      // console.log(this.updatePos);
      // this.dialogVisible = true;
    },
    handleDelete(index, data) {
      this.$confirm(
        "此操作将永久删除【" + data.name + "】职位, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest("/system/basic/pos/" + data.id).then((resp) => {
            if (resp) {
              this.initPositions();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    initPositions() {
      this.loading = true;
      this.getRequest("/system/basic/pos/").then((resp) => {
        this.loading = false;
        if (resp) {
          this.positions = resp;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    deleteMany() {
      this.$confirm(
        "此操作将永久删除【" +
          this.multipleSelection.length +
          "】条记录, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let ids = "?";
          this.multipleSelection.forEach((item) => {
            ids += "ids=" + item.id + "&";
          });
          this.deleteRequest("/system/basic/pos/" + ids).then((resp) => {
            if (resp) {
              this.initPositions();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style>
.addPosInput {
  width: 300px;
  margin-right: 10px;
}
.posManaMain {
  margin-top: 10px;
}
.updatePosInput {
  width: 200px;
  margin-left: 8px;
}
</style>