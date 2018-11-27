<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class MapsController extends AbstractController
{
    /**
     * @Route("/search", name="search")
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function search(Request $request)
    {
        return $this->render('search.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..'),
            'city' => $request->query->get('city')
        ]);
    }
}
