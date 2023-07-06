
export const strict = false;

export const state = () => ({
  todos: [],
  initialData:[]
});

export const getters = {

  getAllTodos(state) {
    return state.todos;
  },

};

export const mutations = {

  fetchTodos(state, payload) {
    let arr=[]
    arr=payload
    arr.sort((a, b) => a.uOrder - b.uOrder)
    state.todos =arr 
    state.initialData=arr
  },

  createTodo(state, payload) {
    let ns = payload
    ns.tasks = []
    state.todos.unshift(ns);
  },

  setTodos(state, payload) {
    state.todos = payload;
  },

  getFilterMyTasks(state,payload){
    let data=[]
    let arr=[]
    data=state.initialData
    data = data.filter((item) => item.tasks.length > 0);
    console.log("232",data) 

  //   if(payload.groupBy!=""){ 
  //     if(data[0].tasks){
  //       let _arr = [];
  //       data.forEach((ele) => {
  //           _arr = _arr.concat(ele.tasks);
  //         });
  //         data = _arr;
  //     }
  //     console.log("2",data)
  //   }
   

  //  if(payload.filter=="incomplete")
  //  {
    
  //    if(payload.groupBy!=""){
  //     arr=data.filter((item)=>item.statusId!==5)
  //      arr=this.$groupBy(arr,payload.groupBy)
  //    }
  //    else {
  //      arr = data.filter((ele) => {
  //       ele.tasks = ele.tasks.filter((item) => item.statusId != 5);
  //       return ele.tasks.length > 0; // Return true only if ele.tasks has at least one remaining task
  //     });
  //    }  
  //  }

  //  if(payload.filter=="complete")
  //  {
  //    if(payload.groupBy!=""){
  //     arr=data.filter((item)=>item.statusId==5)
  //      arr=this.$groupBy(arr,payload.groupBy)
  //    }
  //    else {
  //        arr = data.filter((ele) => {
  //       ele.tasks = ele.tasks.filter((item) => item.statusId == 5);
  //       return ele.tasks.length > 0; // Return true only if ele.tasks has at least one remaining task
  //     });
  //    }    
  //  }
  //  if(payload.filter=="all")
  //  {
  //    if(payload.groupBy!=""){
  //      arr=this.$groupBy(data,payload.groupBy)
  //    }  
  //    else{
  //     arr=state.initialData
  //    } 
  //  }

  // state.todos=arr
  },

  groupMyTasks(state, payload) {
    let arr = JSON.parse(JSON.stringify(state.todos));
    arr.filter((item)=>{
      if(item.tasks.length>0){
        return item
      }
    })

    if(arr[0].tasks){
      let _arr = [];
        arr.forEach((ele) => {
          _arr = _arr.concat(ele.tasks);
        });
        arr = _arr;
    }
    if(payload.sName==""){
      state.todos=state.initialData
    }
    else {
     state.todos=this.$groupBy(arr,payload.sName)
    }
  },
};

export const actions = {

  async fetchTodos(ctx, payload) {
    const res = await this.$axios.$get('/todo/all', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter ? payload.filter : 'all' }
    });

    if (res.statusCode == 200) {
      ctx.commit('fetchTodos', res.data);
      if(payload.sName&&payload.sName!=="default"){
        const data={
          sName:payload.sName,
          team:ctx.rootState.user.teamMembers
        }
        ctx.commit('groupMyTasks',data)
      }
    }

    return res
  },


  setTodos(ctx, payload) {
    ctx.commit('setTodos', payload)
  },

  async createTodo(ctx, payload) {
    const res = await this.$axios.$post('/todo', payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    ctx.commit('createTodo', res.data)
    return res
  },

  async renameTodo(ctx, payload) {

    const res = await this.$axios.$put("/todo", payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })

    return res
  },

  async deleteTodo(ctx, payload) {
    const res = await this.$axios.$delete("/todo", {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
      data: { id: payload.id }
    })

    return res
  },

  sortTodoTasks(ctx, payload) {
    ctx.commit('sortTodoTasks', payload)
  }

};
