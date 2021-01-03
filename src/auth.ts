import Keycloak from 'keycloak-js'

class Authentication {
  public keycloak: any
  private authenticated = false
  private refreshInterval = 0
  private profile = {}

  private initOptions = {
    url: 'http://localhost:8080/auth',
    realm: 'my-demo',
    clientId: 'spring-boot',
    onLoad: 'check-sso'
  }

  public init () {
    if (!this.keycloak) {
      this.keycloak = Keycloak(this.initOptions)

      this.keycloak.onReady = function (auth: boolean) {
        this.authenticated = auth
      }

      this.keycloak.onAuthSuccess = function () {
        this.authenticated = true
      }

      this.keycloak.onAuthLogout = function () {
        this.authenticated = false
      }

      this.keycloak.init({ onLoad: 'check-sso' })
        .then((auth: boolean) => {
          if (auth) {
            this.refreshInterval = setInterval(() => {
              this.keycloak.updateToken(5).catch(() => {
                this.keycloak.clearToken()
              })
            }, 6000)

            // this.keycloak.loadUserProfile()
            //   .then(function (profile: any) {
            //     app.profile = profile
            //   })
          }
        })
    }
  }

  public login () {
    this.keycloak.login()
  }

  public logout () {
    clearInterval(this.refreshInterval)
    this.keycloak.logout()
    this.authenticated = false
  }

  public userProfile () {
    if (this.profile) {
      return this.profile
    }

    return {}
  }

  public hasRole (role: string) {
    if (this.authenticated) {
      return this.keycloak.hasResourceRole(role)
    }

    return false
  }

  public hasRealmRole (role: string) {
    if (this.authenticated) {
      return this.keycloak.hasRealmRole(role)
    }

    return false
  }

  public isAuthenticated () {
    return this.authenticated
  }

  public authorize (role: string, callback: CallableFunction) {
    if (this.keycloak.hasResourceRole(role)) {
      callback()
    }
  }
}

export { Authentication }
