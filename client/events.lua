RegisterNetEvent("UIMessage", function(action, data)
  UIMessage(action, data)
end)

RegisterNetEvent("vhud:client:cb", function(plist)
  UIMessage("nui:state:onlineplayers", #plist)
  Debug("[Script.GrabPlayerCount] Player count sent to the NUI: ", #plist)
end)
