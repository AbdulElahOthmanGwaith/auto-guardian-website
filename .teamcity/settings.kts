import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs

version = "2021.1"

project {
    id("AutoGuardianWebsite")
    name = "Auto Guardian Website"
    description = "موقع Auto Guardian Core الرسمي"

    buildType(BuildWebsite)
    buildType(DeployWebsite)

    params {
        param("github.owner", "AbdulElahOthmanGwaith")
        param("github.repo", "auto-guardian-website")
        param("vercel.token", "%vercel_token%")
    }
}

object BuildWebsite : BuildType({
    id("BuildWebsite")
    name = "Build Website"
    description = "بناء الموقع"

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Install Dependencies"
            scriptContent = """
                npm install
            """.trimIndent()
        }
        script {
            name = "Build"
            scriptContent = """
                npm run build
            """.trimIndent()
        }
        script {
            name = "Test"
            scriptContent = """
                npm test || true
            """.trimIndent()
        }
    }

    triggers {
        vcs {
            branchFilter = "+:*"
        }
    }

    failureConditions {
        executionTimeoutMin = 30
    }
})

object DeployWebsite : BuildType({
    id("DeployWebsite")
    name = "Deploy to Vercel"
    description = "نشر إلى Vercel"

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Deploy to Vercel"
            scriptContent = """
                npm install -g vercel
                vercel --prod --token %vercel_token%
            """.trimIndent()
        }
    }

    dependencies {
        dependency(BuildWebsite) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        }
    }

    triggers {
        vcs {
            branchFilter = "+:master"
        }
    }
})
