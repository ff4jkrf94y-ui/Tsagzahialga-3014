import asyncio
from pathlib import Path
from datetime import datetime,timedelta
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  admin=await browser.new_page()
  await admin.add_init_script("window.toneCount=0;const orig=AudioContext.prototype.createOscillator;AudioContext.prototype.createOscillator=function(...args){window.toneCount++;return orig.apply(this,args);};")
  await admin.goto('http://localhost:4200/admin');env=dict(l.split('=',1) for l in Path('.env').read_text().splitlines() if '=' in l)
  await admin.locator('input[name=email]').fill(env['ADMIN_EMAIL'].strip('\"\''));await admin.locator('input[name=password]').fill(env['ADMIN_PASSWORD'].strip('\"\''));await admin.get_by_role('button',name='Нэвтрэх',exact=True).click()
  await admin.get_by_role('button',name='Дуут мэдэгдэл асаах').click();assert await admin.evaluate('window.toneCount')==3
  guest=await browser.new_page();await guest.goto('http://localhost:4200');await guest.get_by_role('button',name='Цаг захиалах',exact=True).click();await guest.get_by_role('button',name='Үргэлжлүүлэх').click();await guest.locator('input[type=date]').fill((datetime.now()+timedelta(days=21)).strftime('%Y-%m-%d'));await guest.locator('.times button').first.click();await guest.get_by_role('button',name='Үргэлжлүүлэх').click();await guest.locator('input[name=name]').fill('Дуут мэдэгдлийн тест');await guest.locator('input[name=phone]').fill('99112233');await guest.get_by_role('button',name='Захиалга илгээх').click();await guest.get_by_text('Захиалга илгээгдлээ.',exact=True).wait_for()
  await admin.locator('.new-booking').filter(has_text='Дуут мэдэгдлийн тест').wait_for(timeout=20000);assert await admin.evaluate('window.toneCount')==6
  card=admin.locator('article').filter(has_text='Дуут мэдэгдлийн тест');await card.get_by_role('button',name='Баталгаажуулах',exact=True).click();await card.get_by_role('link',name='SMS мэдэгдэл нээх').wait_for();assert await admin.evaluate('window.toneCount')==6
  await admin.get_by_role('button',name='Дуу унтраах').click();await admin.get_by_role('button',name='Дуут мэдэгдэл асаах').wait_for();await admin.reload();await admin.get_by_role('button',name='Дуут мэдэгдэл асаах').wait_for();assert await admin.locator('.new-booking').count()==0;assert await admin.evaluate('window.toneCount')==0
  print('Verified: audio enabled, 3-tone sound for new booking via polling, no extra sound on status change, off toggle and quiet initial load.')
  await browser.close()
asyncio.run(main())
