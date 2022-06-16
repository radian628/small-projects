export function drawTree(settings) {

    function drawTreeBranch(branchSettings) {
        // get rid of small tree branches if that setting is enabled
        if (
            settings.deleteSmall 
            && branchSettings.currentLength < settings.smallThreshold
        ) return;

        // calculate final branch positions
        let finalPosX = 
            branchSettings.x 
            + Math.cos(branchSettings.angle) * branchSettings.length;
        let finalPosY =
            branchSettings.y 
            + Math.sin(branchSettings.angle) * branchSettings.length;
        
        // draw line
        settings.ctx.moveTo(branchSettings.x, branchSettings.y);
        settings.ctx.lineTo(finalPosX, finalPosY);
        
        // recursion ends here
        if (branchSettings.depthRemaining <= 0) return;
        
        // draw first branch
        drawTreeBranch({
            x: finalPosX,
            y: finalPosY,
            angle: branchSettings.angle + settings.angle1
                * ((1 - branchSettings.depthRemaining % 2) * 2 - 1),
            length: branchSettings.length * settings.mag1,
            depthRemaining: branchSettings.depthRemaining - 1
        });
        
        // draw second branch
        drawTreeBranch({
            x: finalPosX,
            y: finalPosY,
            angle: branchSettings.angle + settings.angle2
                * ((1 - branchSettings.depthRemaining % 2) * 2 - 1),
            length: branchSettings.length * settings.mag2,
            depthRemaining: branchSettings.depthRemaining - 1
        });
    }

    // draw initial branch
    drawTreeBranch({
        x: settings.startX,
        y: settings.startY,
        angle: settings.startAngle,
        length: settings.startLength,
        depthRemaining: settings.depth
    });
}
