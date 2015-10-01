const pm2 = require('pm2')
const chalk = require('chalk')

const INSTANCES = process.env.WEB_CONCURRENCY || 3
const MAX_MEMORY = process.env.WEB_MEMORY || 512
const PRIVATE_KEY = process.env.KEYMETRICS_PRIVATE_KEY || ''
const PUBLIC_KEY = process.env.KEYMETRICS_PUBLIC_KEY || ''
const MACHINE_NAME = process.env.MACHINE_NAME || ''
const ENV = process.env.NODE_ENV || 'development'

pm2.connect(function() {
  pm2.start({
    exec_mode: 'cluster',
    ignore_watch: ['node_modules'],
    instances : INSTANCES,
    max_memory_restart : MAX_MEMORY + 'M',
    name: 'app',
    node_args: '--harmony',
    script: 'src/index.js',
    watch: 'development' === ENV ? 'src' : false
  }, function() {

    if (PRIVATE_KEY && PUBLIC_KEY && MACHINE_NAME) {
      pm2.interact(PRIVATE_KEY, PUBLIC_KEY, MACHINE_NAME, function() {

       // Display logs in standard output
        pm2.launchBus(function(err, bus) {
          console.log(chalk.blue('[PM2]'), ' Log streaming started')

          bus.on('log:out', function(packet) {
            console.log(chalk.green('[App:%s] %s'), packet.process.name, packet.data)
          })

          bus.on('log:err', function(packet) {
            console.error(chalk.red('[App:%s][Err] %s'), packet.process.name, packet.data)
          })
        })
      })
    }
  })
})
