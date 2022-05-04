import {HYEventStore} from 'hy-event-store'
import {getTagList} from '../service/api/assist'

const eventStore = new HYEventStore({
  state:{
    tagList:[]
  },
  actions:{
    async getTagListAction(ctx){
      try {
        const tagList = await getTagList()
        ctx.tagList = tagList.data
      } catch (error) {
        console.log(error);
      }
    }
  }
})

export default eventStore