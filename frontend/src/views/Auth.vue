<template>
    <div>
        <login/>
        <h2>Si vous n'avez pas encore de compte vous devez vous inscrire</h2>
        <signup/>
    </div>    
</template>

<script>
import Login from '../components/Login'
import Signup from '../components/Signup'

export default {
  components: { Login, Signup },
    name: "Auth"
}
</script>