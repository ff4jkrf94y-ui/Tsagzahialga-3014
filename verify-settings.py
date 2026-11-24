import asyncio
from pathlib import Path
from datetime import datetime,timedelta
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  page=await b.new_page(viewport={'width':1100,'height':1000})
  await page.goto('http://localhost:4200');await page.locator('header').get_by_role('link',name='Админ нэвтрэх').click()
  env=dict(l.split('=',1) for l in Path('.env').read_text().splitlines() if '=' in l)
  await page.locator('input[name=email]').fill(env['ADMIN_EMAIL'].strip('\"\''));await page.locator('input[name=password]').fill(env['ADMIN_PASSWORD'].strip('\"\''));await page.get_by_role('button',name='Нэвтрэх',exact=True).click()
  await page.get_by_role('heading',name='Салоны тохиргоо').wait_for()
  original={k:await page.locator(f'input[name={k}]').input_value() for k in ['address','phone','open','close']}
  await page.locator('input[name=address]').fill('Туршилтын хаяг');await page.locator('input[name=open]').fill('11:00')
  await page.get_by_role('button',name='Тохиргоо хадгалах').click();await page.get_by_text('Тохиргоо хадгалагдлаа.',exact=True).wait_for()
  await page.reload();await page.locator('input[name=address]').wait_for();assert await page.locator('input[name=address]').input_value()=='Туршилтын хаяг'
  await page.goto('http://localhost:4200');await page.get_by_text('Туршилтын хаяг',exact=True).wait_for();await page.get_by_role('button',name='Цаг захиалах',exact=True).click();await page.get_by_role('button',name='Үргэлжлүүлэх').click();await page.locator('input[type=date]').fill((datetime.now()+timedelta(days=4)).strftime('%Y-%m-%d'));await page.get_by_role('button',name='11:00',exact=True).wait_for();assert await page.get_by_role('button',name='10:00',exact=True).count()==0
  await page.goto('http://localhost:4200/admin');await page.locator('input[name=address]').wait_for()
  for k,v in original.items():await page.locator(f'input[name={k}]').fill(v)
  await page.get_by_role('button',name='Тохиргоо хадгалах').click();await page.get_by_text('Тохиргоо хадгалагдлаа.',exact=True).wait_for()
  await page.screenshot(path='/home/user/babes-nails/admin-settings.png',full_page=True)
  print('Verified settings persistence, public address, booking hours. Original settings restored.')
  await b.close()
asyncio.run(main())
