import axios, { AxiosResponse } from 'axios'
import * as A from 'fp-ts/Array'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/Either'
import { of } from 'fp-ts/Identity'
import { zero } from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'
import { Status, AapiBody, EventBody,UserState } from './serviceObject'
import fileDownload from 'js-file-download'

export class NodeService {
  // async getProductSuiteData() {
  //   return await axios.get<AapiBody[]>('./productsuite')
  // }
  //urlconfig = "http://localhost:3000"
  urlconfig = "/v1"

  downloadCredFile(productSuite: string, account: string): TE.TaskEither<Error,void>{
    //console.log(productSuite,account)
    return pipe(
      TE.tryCatch<Error,AxiosResponse<void>>(
        () => axios.get<void>(`${this.urlconfig}/credential/${productSuite}/${account}`),
        (err) => new Error(`Download File Eror: ${err}`)
      ),
      TE.map<AxiosResponse<void>, void>((res)=>res.data)
    )
  }
  getProductSuiteData(): TE.TaskEither<Error, Array<AapiBody>> {
    return pipe(
      TE.tryCatch<Error, AxiosResponse<Array<AapiBody>>>(
        () => axios.get<Array<AapiBody>>(`${this.urlconfig}/productsuite`),
        (err) => new Error(`GET ProductSuite Error: ${err}`)
      ),
      TE.map<AxiosResponse<Array<AapiBody>>, Array<AapiBody>>((res) =>
        res.data
      )
    )
  }
  getMyEventData(): TE.TaskEither<Error, EventBody> {
    return pipe(
      TE.tryCatch<Error, AxiosResponse<EventBody>>(
        () => axios.get<EventBody>(`${this.urlconfig}/myevent`),
        (err) => new Error(`GET My Event Page Error: ${err}`)
      ),
      TE.map<AxiosResponse<EventBody>, EventBody>((res) =>
        'event' in res.data
          ? 'own' in res.data['event'] && 'subscribe' in res.data['event']
            ? res.data['event']
            : zero<EventBody>()
          : zero<EventBody>()
      )
    )
  }
  
  getApiData(id: string): TE.TaskEither<Error, AapiBody> {
    console.log('Get id from params: ', id)
    return pipe(
      TE.tryCatch<Error, AxiosResponse<AapiBody>>(
        () => axios.get<AapiBody>(`${this.urlconfig}/aapi/${id}`),
        (err) => new Error(`GET API Info Error: ${err}`)
      ),
      TE.map<AxiosResponse<AapiBody>, AapiBody>((res) => res.data
      )
    )
  }
  getLoginState(): TE.TaskEither<Error, UserState>{
    console.log('Check Login status')
    return pipe(
      TE.tryCatch<Error, AxiosResponse<UserState>>(
        () => axios.get<UserState>(`${this.urlconfig}/login`),
        (err) => new Error(`GET User Status Error: ${err}`)
      ),
      TE.map<AxiosResponse<UserState>, UserState>((res) => res.data
      )
    )
  }
  
  
  /*
  async getApiData(id: string) {
    console.log('Get id from params: ', id)
    //const path:string = ('/api/'.concat(String(id)))
    //console.log(path)
    try {
      const res = await axios.get(`/v1/aapi/${id}`)

      return res.data
    } catch (e) {
      return console.error(e)
    }
  }
  async postRegistApiForm(apiName: string, productSuite: string, apiOwner: string, docs: string) {
    try {
      const res = await axios.post('/aapi', {
        title: apiName,
        productSuite: productSuite,
        apiOwner: apiOwner,
        docs: docs,
      })
      console.log(res)
    } catch (e) {
      return console.error(e)
    }
  }
  
    async getApiData(id:string)
    {
        console.log("Get id from params: ",id)
        try {
            const res = await axios.get('/api',{
                params:{
                    id:id
                }
            })
            //console.log(res.data.api)
            console.log(res.data.apiId)
            return res.data.api
        } catch (e) {
            return console.error(e)
        }
    }
    
    */
}
