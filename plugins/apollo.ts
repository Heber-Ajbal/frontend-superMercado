import { defineNuxtPlugin } from '#app'
import { ApolloClients } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const httpLink = createHttpLink({
    uri: config.public.graphqlURL, // ✅ usa la key real
  })
  console.log('Apollo endpoint:', config.public.graphqlURL)

  const authLink = setContext((_, { headers }) => {
    const token = auth.token
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })

  nuxtApp.vueApp.provide(ApolloClients, {
    default: apolloClient
  })
})
