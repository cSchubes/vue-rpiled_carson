import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Posts from '@/components/Posts'
import Color from '@/components/color/Color'
import SavedColors from '@/components/color/SavedColors'
import FavoriteColors from '@/components/color/FavoriteColors'
import AnimationLayout from '@/components/animations/Layout'
import AnimationTemplates from '@/components/animations/Templates'
import SavedAnimations from '@/components/animations/Saved'
import FavoriteAnimations from '@/components/animations/Favorites'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/posts',
      name: 'Posts',
      component: Posts
    }, 
    {
      path: '/color',
      name: 'Color',
      component: AnimationLayout,
      children: [
        {
          path: 'picker',
          name: 'Picker',
          component: Color
        },
        {
          path: 'saved',
          name: 'Saved',
          component: SavedColors,
        },
        {
          path: 'favorites',
          name: 'Favorites',
          component: FavoriteColors,
        },

      ]
    },
    {
      path: '/animation',
      name: 'Animation',
      component: AnimationLayout,
      children: [
        {
          path: 'templates',
          name: 'Templates',
          component: AnimationTemplates
        },
        {
          path: 'saved',
          name: 'Saved',
          component: SavedAnimations
        },
        {
          path: 'favorites',
          name: 'Favorites',
          component: FavoriteAnimations
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }

    
  ]
})
